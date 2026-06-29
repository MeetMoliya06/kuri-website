# Complete Backend Flow

## Tables

* **visits** — entry point, one row per user per restaurant. User visits restaurant → INSERT here. Stores: sentiment, notes, photo, dishes.
* **user_rankings** — personal ordered list. After comparisons done → INSERT here. Stores: position within category + sentiment tier.
* **ranking_comparisons** — every A vs B decision ever made. Each comparison tap → INSERT here. Stores: winner, loser, category, sentiment.
* **restaurant_elo** — community score per restaurant. Auto-updated by update_elo() after each loved comparison. Stores: elo_score, comparison_count, unique_users.

---

## Functions

* **record_comparison(user_id, winner_id, loser_id, category, sentiment)** — called after each tap in comparison screen. → validates: caller = user, both restaurants visited, correct category. → INSERTs into ranking_comparisons. → if sentiment = 'loved' → calls update_elo().
* **update_elo(winner_id, loser_id, category, user_id)** — called by record_comparison automatically. → fetches current Elo of both restaurants. → calculates K factor (32/16/8 based on comparison count). → calculates expected scores. → UPDATEs elo_score + comparison_count + unique_users for both.
* **place_restaurant_ranking(user_id, restaurant_id, category, sentiment, position)** — called once after all comparisons done. → validates: caller = user, visit exists, not already ranked. → shifts all restaurants at/below position down by 1. → INSERTs new restaurant at final position.

---

## Views

* **restaurant_leaderboard** — reads from restaurant_elo + restaurants. Normalises Elo to 1-10 display score using PERCENT_RANK. Only shows restaurants with 5+ comparisons from 3+ unique users. Partitioned by category (cafe / restaurant).

---

## Full User Flow

1. **User opens restaurant detail page** → taps "I've been here"
2. **Sentiment screen appears** → picks: Loved it / Liked it / Not Good → optionally adds: dishes, notes, photo → INSERT into visits
3. **App fetches user's current ranked list** → SELECT from user_rankings WHERE user_id = X AND category = 'restaurant' AND sentiment_tier = 'loved' ORDER BY rank_position → returns ordered array e.g. [Honest, Zaika, Sai Dining]
4. **Binary search begins on client** → compare new restaurant against middle of list → each tap calls record_comparison() → record_comparison INSERTs comparison + updates Elo → repeat until position found (max log₂(n+1) taps)
5. **Position determined client-side** → calls place_restaurant_ranking(position) → shifts existing positions down → INSERTs new restaurant at correct position
6. **Confirmation shown to user** → "Roman Dine ranked #2 in your Restaurants" → "Right behind Honest · Just ahead of Zaika"

---

## Community Ranking Flow

* **Every loved comparison** → update_elo() fires → winner Elo increases → loser Elo decreases → K factor smaller as comparison_count grows (more stable) → unique_users tracked per restaurant
* **restaurant_leaderboard view reads restaurant_elo** → PERCENT_RANK normalises to 1-10 → only restaurants with 5+ comparisons, 3+ unique users shown → partitioned by category

---

## Gamification Flow

* **visits table** → user_gamification_stats mat view (refreshes hourly) → base XP: 10 per visit → dish XP: +2 per dish (max 6) → notes XP: +3 → photo XP: +5 → pioneer XP: +15 if first 5 to visit restaurant → comparison XP: +5 per session
* **streak from visits** → multiplier 1.0x or 1.2x
* **lifetime_points** → user_level (1-50)
* **badges from visit patterns** → scout, paparazzi, critic

---

## What Didn't Change

* **restaurants table** — unchanged
* **profiles table** — unchanged
* **lists table** — unchanged
* **list_restaurants table** — unchanged
* **home_cards table** — unchanged
* **handle_new_user()** — unchanged
* **populate_curated_lists()** — unchanged
* **add_restaurant_full()** — unchanged (broken but separate issue)
* **delete_user_account()** — updated to delete visits/rankings/comparisons
* **get_list_items()** — updated to use restaurant_elo instead of restaurant_rankings