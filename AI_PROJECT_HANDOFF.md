
# Kori App — Complete AI Project Handoff

> Snapshot date: 2026-06-27 at 04:20 PM (IST)  
> Project path: `D:\mobile-app\kori`  
> Purpose: Give a new AI enough context to work on this app without repeatedly rediscovering the codebase.

## 1. Mandatory instruction for every AI

Before writing or changing application code, read the exact Expo SDK 54 documentation:

https://docs.expo.dev/versions/v54.0.0/

Do not rely on examples for a different Expo version. This repository's `AGENTS.md` makes this a hard requirement. Always inspect the git status and diff before editing.

Never paste `.env` values into chat, documentation, commits, or source code. Only the environment-variable names are safe to discuss.

### 1.1 Project Conventions (Do NOT change)

To preserve architectural consistency, follow these hard constraints:
- **Expo SDK**: Must remain on version **54**. Do not upgrade dependencies or use newer features not supported by SDK 54.
- **Routing**: Expo Router is strictly file-based. Do not introduce custom navigators outside the current file system routes.
- **State Management**: Do **NOT** introduce Redux, MobX, or similar libraries. Use React Context.
- **Data Fetching**: Do **NOT** install React Query (TanStack Query) or RTK Query. Use standard `supabase-js` client with React state/hooks.
- **Global Event Bus**: [ReviewContext.tsx](file:///D:/mobile-app/kori/context/ReviewContext.tsx) acts as the global event bus bridging submissions, profile reload triggers, and level-up celebrations.
- **Leaderboards**: Ranks and stats must come from database views (`foodie_leaderboard_global`, etc.).
- **Algorithm Scores**: Never compute restaurant ranking or gamification scores on the client side. The client should only consume views or trigger database calculations via context inserts.

## 2. Product summary

Kori (displayed as **kuri** in the UI) is a mobile-first restaurant discovery and ranking app currently focused on Surat, India. Users authenticate, browse curated restaurant lists, search verified restaurants, view restaurant details and community reviews, publish scored reviews with photos and dish names, organize restaurants into personal lists, view their profile/rankings, and compare foodie or restaurant leaderboards.

The product's main concepts are:

- **Restaurants:** searchable Surat venues with area, type, photos, price, contact details, Google metadata, and Kori reviews.
- **Reviews/rankings:** users give food, ambiance, and presentation scores from 1–10. The database supplies `final_score` (the UI previews the arithmetic mean).
- **Curated lists:** editorial lists reached from Home using short slugs such as `top50` and `bestcoffee`.
- **Personal lists:** user-owned lists identified by UUIDs. A restaurant can be added to multiple lists while publishing a review.
- **Been list:** a virtual list derived from all restaurants the current user has reviewed; it is not a normal `lists` row.
- **Leaderboards:** global or area-scoped rankings for foodies and restaurants, read from database views.

## 3. Technology snapshot

- Expo SDK `~54.0.34`
- React Native `0.81.5`
- React `19.1.0`
- TypeScript `~5.9.2`
- Expo Router `~6.0.23` with typed routes enabled
- Supabase JS `^2.108.2`
- React Navigation 7
- New Architecture enabled
- React Compiler enabled
- Portrait orientation
- Android edge-to-edge enabled
- Web output configured as static
- Mapbox integration via `@rnmapbox/maps` (`^10.3.1`) for native maps on restaurant details

Important libraries:

- `@rnmapbox/maps` for rendering interactive maps with outdoor vector styling and custom annotations.
- `expo-image` for cached images on Home and list screens
- React Native `Image` on search, leaderboard, and profile screens
- `expo-image-picker` and `expo-file-system` for photo selection/readback (review upload, profile avatar)
- `base64-arraybuffer` for Supabase Storage uploads
- `expo-haptics` for interaction feedback
- `lottie-react-native` for Home and review-success animations
- `@react-native-community/slider` for review scores
- `react-native-animated-numbers` for score animation
- `expo-linear-gradient` for list cover overlays
- AsyncStorage for auth persistence and recent searches

Run commands:

```bash
npm install
npx expo start
npm run android # compiles development build via expo run:android
npm run ios     # compiles development build via expo run:ios
npm run web
npm run lint
```

### 3.1 Folder architecture

The codebase is organized as follows:
- `app/` — File-based router screens (Expo Router stack layout and tabs).
- `components/` — Shared UI components (ReviewModal, SaveToListModal, profile level/toast overlays).
- `context/` — Global context providers ([ReviewContext.tsx](file:///D:/mobile-app/kori/context/ReviewContext.tsx) for submissions and event bridging).
- `hooks/` — Custom React hooks (useLeaderboard, data fetching logic).
- `lib/` — Shared libraries and configurations (Supabase client, gamification utilities, themes).
- `constants/` — UI colors, themes, categories, and typography constants.
- `assets/` — Static assets including category icons, success animations, and logos.

```text
kori/
├── .claude/
│   ├── .env
│   └── settings.json
├── .vscode/
│   ├── extensions.json
│   └── settings.json
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   ├── index.tsx         (Home tab)
│   │   ├── leaderboard.tsx   (Leaderboard tab)
│   │   ├── lists.tsx         (Your Lists tab)
│   │   ├── my-list.tsx       (Profile tab)
│   │   └── search.tsx        (Search & Add to List tab)
│   ├── list/
│   │   └── [id].tsx          (List Detail screen)
│   ├── profile/
│   │   ├── [username].tsx    (Public profile view)
│   │   └── edit.tsx          (Edit profile screen)
│   ├── restaurant/
│   │   └── [id].tsx          (Restaurant Detail screen)
│   ├── _layout.tsx           (Root layout stack, auth guard, level-up & achievement toasts)
│   ├── auth.tsx              (Login/Signup flow screen)
│   └── modal.tsx
├── assets/
│   ├── animations/           (Lottie success & eat animations)
│   ├── icons/                (Home category active/inactive icons)
│   ├── images/               (Splash icons, logo, app icon)
│   └── sounds/               (Audio review feedback)
├── components/
│   ├── leaderboard/          (Podium, LeaderboardRow, ScopePicker, SegmentedControl)
│   ├── profile/              (LevelCard, StatsCard, AchievementCard, SettingsModal, LevelUpModal, AchievementToast)
│   ├── ui/                   (Collapsible, IconSymbol helpers)
│   ├── HapticTab.tsx
│   ├── ReviewModal.tsx       (Submission slider modal & photo upload)
│   ├── SaveToListModal.tsx   (Bookmark list selection bottom sheet)
│   ├── haptic-tab.tsx
│   └── themed-text.tsx / themed-view.tsx
├── constants/
│   └── theme.ts
├── context/
│   └── ReviewContext.tsx     (Global ReviewProvider & submission event bus)
├── hooks/
│   ├── use-color-scheme.ts
│   ├── use-theme-color.ts
│   └── useLeaderboard.tsx    (Materialized view ranking hook)
├── lib/
│   ├── gamification.ts       (XP, streak, badge thresholds)
│   ├── leaderboard-theme.ts  (iOS green styles)
│   ├── leaderboard-types.ts
│   └── supabase.ts           (Supabase shared Client)
├── scripts/
│   └── reset-project.js
├── AGENTS.md                 (Expo 54 guidelines)
├── AI_PROJECT_HANDOFF.md     (This handbook document)
├── tsconfig.json
├── eslint.config.js
└── package.json
```

## 4. Configuration and environment

[app.json](file:///D:/mobile-app/kori/app.json) identifies the app as `kori`, scheme `kori`, owner `arsinic`, EAS project ID `9c57e43a-1305-41d7-b10f-4cd00a9f1b04`, and package name `com.arsinic.kori`. It includes `@rnmapbox/maps` in the plugins config.

[supabase.ts](file:///D:/mobile-app/kori/lib/supabase.ts) creates one shared Supabase client. It requires these public environment variables:

```text
EXPO_PUBLIC_SUPABASE_URL
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY
EXPO_PUBLIC_MAPBOX_TOKEN
```

Auth sessions are persisted in AsyncStorage, automatically refreshed, and URL session detection is disabled. An `.env` file exists locally; treat its contents as secret even though the key used by the client is a publishable/anonymous key.

## 5. Routing and authentication

The app uses file-based routing.

```text
app/_layout.tsx                 Root layout, auth guard, LevelUpModal, AchievementToast
app/auth.tsx                    Login/sign-up screen
app/(tabs)/_layout.tsx          Five-tab navigator
app/(tabs)/index.tsx            Home
app/(tabs)/leaderboard.tsx      Leaderboard
app/(tabs)/lists.tsx            Your Lists
app/(tabs)/search.tsx           Search / add-meal entry point
app/(tabs)/my-list.tsx          Profile
app/list/[id].tsx               Curated, personal, or Been list detail
app/restaurant/[id].tsx         Restaurant detail and reviews
app/profile/[username].tsx      Public profile view (read-only details, gamification stats)
app/profile/edit.tsx            Profile edit (name, avatar upload)
app/modal.tsx                   Unused Expo starter modal
```

[app/_layout.tsx](file:///D:/mobile-app/kori/app/_layout.tsx) registers the root router stack, hiding headers for `(tabs)`, `auth`, `restaurant/[id]`, `profile/edit`, `profile/[username]`, and `list/[id]`. It loads the existing Supabase session and subscribes to auth state changes. When session loading finishes:

- an unauthenticated user inside `(tabs)` is redirected to `/auth`;
- an authenticated user on `/auth` is redirected to `/(tabs)`.

The guard only explicitly recognizes the tabs group and auth screen. Deep links to `/restaurant/[id]`, `/profile/[username]`, or `/list/[id]` are not explicitly protected by this guard, although most write actions independently require a user.

The tab order has been redesigned to: Home, Leaderboard, Search, Your Lists, Profile. The tab navigator is styled following a monochrome "Wired" aesthetic: white canvas bar (#ffffff), pure black active icons (#000000), muted inactive icons (#9ca3af), a square mint active indicator bar (#acfae0) at the top of the active tab, and tab labels are hidden (icon-only design for editorial restraint). A custom `HapticTab` fires selection haptics. There are two case-differing haptic component files (`components/HapticTab.tsx` and `components/haptic-tab.tsx`); the tabs import the uppercase file.

## 6. Screen-by-screen behavior

### 6.1 Auth — `app/auth.tsx`

- One animated segmented form switches between Log in and Sign up.
- Inputs: email and password; password visibility can be toggled.
- Sign-up calls `supabase.auth.signUp({ email, password })` and, upon success, transitions the user to an inline "Profile step" (`Step = 'auth' | 'profile'`) in the auth flow.
- Login calls `supabase.auth.signInWithPassword({ email, password })`.
- Errors are displayed inline using Supabase's message.
- The Profile step allows the user to configure:
  - Username: checked live against the database for availability with a debounced 450ms Postgres query, and validated locally (3–20 characters, lowercase letters, numbers, and underscores).
  - Bio: up to 100 characters.
  - Avatar image: picked from the device library, cropped 1:1, and uploaded to the public `avatars` bucket.
  - A "Skip for now" action allows proceeding without setting these fields immediately.
- There is no forgot-password, email verification explanation, OAuth, or explicit password policy UI.
- Successful navigation is handled indirectly by the root auth-state listener.

### 6.2 Home — [index.tsx](file:///D:/mobile-app/kori/app/(tabs)/index.tsx)

Home is visually category-driven. Four category tabs change the dark header, pastel canvas, watermark, local icon, and carousel content:

| ID | Label | Watermark |
|---|---|---|
| `cafes` | Cafes | `BREW` |
| `all` | Food | `KURI` |
| `pizza` | Pizza | `SLICE` |
| `res` | Dining | `DINE` |

- **Dynamic Curated Carousel**: Carousel cards are loaded dynamically from the `home_cards` table in Supabase (joined with the `lists` table). Banners are prefetched eagerly on mount via `expo-image`. Category selections use haptic and spring-scale animations.
- **Community Feed**: A live feed of recent community reviews is loaded below the carousel, rendering reviews joined with `profiles` and `restaurants` (newest first). The feed cards are styled after the Apple Store utility card format: pure white background, 1px grey border (`#e0e0e0`), 18px rounded corners, 44x44 circular reviewer avatars, dynamic score pills with score-dependent coloring, and details constraints.
- **Header Badges**: Renders the authenticated user's current level and global leaderboard rank dynamically at the top of the screen.
- Tapping the search bar routes to `/search`. Tapping a carousel card routes to `/list/[id]` using its list ID or slug.

### 6.3 Search — `app/(tabs)/search.tsx`

Search has two modes:

1. **Browse mode** when the query is shorter than two characters.
2. **Live results mode** when the query has at least two characters.

On mount it loads up to 15 rows for each browse dataset:

- Trending: newest restaurants added to the platform (`order('created_at', { ascending: false })`). Renders a "New" badge (no score).
- Top Rated: restaurants ordered by `algorithm_score` descending, fetched from the `restaurant_rankings` materialized view. Displays the pre-calculated score.
- Cafes: cafe-type venues, newest first (`order('created_at', { ascending: false })`). Renders a "New" badge (no score).

Browse queries fetch fields `id, name, venue_type, area` and display the restaurant's area in the list subtitle (e.g. "Adajan · Cafe"). The previous client-side score computation (`attachKuriRating`) has been removed in favor of using pre-calculated algorithm scores.

Live search is debounced by 350 ms, queries `id, name, venue_type, area`, and uses Postgres full-text search:

```text
restaurants.search_vector
textSearch type: websearch
config: english
limit: 15
```

The input auto-focuses after tab navigation settles. Selecting a result saves its restaurant name and routes to `/restaurant/{id}` (remapping `restaurant_id` to `id` for Top Rated rankings rows). There is UI text saying additions are locked to verified Surat spots, but there is no user-driven “create restaurant” implementation.

Search also supports an **"Add to List" mode** when accessed with the `addToList` parameter (containing a list UUID) in the URL:
- The header title changes from "kuri" to "Add to List" and displays a descriptive subtitle.
- Tapping a search result routes the user to `/restaurant/[id]` while forwarding the `addToList` parameter.

### 6.4 Restaurant detail — [[id].tsx](file:///D:/mobile-app/kori/app/restaurant/[id].tsx)

The screen fetches in parallel:

- one `restaurants` row by `id` using `select('*').single()`;
- all matching `reviews`, newest first, embedding reviewer `profiles(full_name, avatar_url)`.

It displays:

- **Interactive Map**: Renders an interactive `MapView` using `@rnmapbox/maps` if coordinates `lat`/`lon` exist on the restaurant. It uses the `mapbox://styles/mapbox/outdoors-v12` vector style with a custom marker pin, and is non-interactive for display purposes (scroll/zoom/rotate disabled, 45 degree pitch, centered on coordinates). If coordinates do not exist, it falls back to a map outline placeholder icon.
- venue name, verification mark, area, venue type, rupee price level, and Google rating/count.
- Kori score computed as the mean of loaded `final_score` values.
- Call, Website, and Directions deep-link actions when data exists (Directions opens Google Maps with the restaurant's `lat`/`lon`).
- community review cards with reviewer, date, dishes, photo, notes, final score, and three component scores.
- sticky “Rate this place” button opening `ReviewModal`.
- **Realtime Listener**: Subscribes to Supabase Postgres changes on the `reviews` table filtered by `restaurant_id = eq.{id}`. When another client inserts a review, it silently refreshes the restaurant data.
- **Bookmarks**: Opens `SaveToListModal` via `handleSaveToList` (with haptic feedback) to save the restaurant to personal lists.

### 6.5 Review modal — `components/ReviewModal.tsx`

The modal supports:

- food, ambiance, and presentation sliders from 1–10, initially 5;
- displayed overall preview `(food + ambiance + presentation) / 3`;
- optional note;
- optional comma-separated dish names, converted to `string[]`;
- optional camera/library photo, cropped to 4:3 at quality 0.7;
- selection of multiple personal lists;
- creation of a personal list without leaving the modal;
- haptics, animated numbers, layout animation, loading state, and Lottie success state.

Photo upload flow:

1. Read selected local URI through Expo FileSystem `File.base64()`.
2. Decode base64 into an ArrayBuffer.
3. Upload to public bucket `food_photos` at `{userId}/{timestamp}.{ext}`.
4. Store the returned public URL in the review.

Review insert fields are `restaurant_id`, `user_id`, `food_score`, `ambiance_score`, `presentation_score`, `notes`, `dish_names`, and `photo_url`. `final_score` is not inserted by the client, so it must be database-generated. Selected list links are upserted into `list_restaurants` with conflict key `(list_id, restaurant_id)` and `ignoreDuplicates: true`.

Important review-modal caveats:

- The success flow stores `finishedReview` in state and also schedules a timeout whose closure may see the previous state value. Verify that `onSubmitSuccess` reliably receives the new row.
- A review may succeed even if adding it to selected lists fails; that secondary error is only logged.
- There is no duplicate-review policy in client code; database constraints/RLS determine what happens.
- Public photo objects are not deleted if later database work fails or content is removed.

### 6.5a Save to list modal — `components/SaveToListModal.tsx`

This modal is a bottom-sheet interface that enables users to:
- Select one or multiple personal lists to save the current restaurant to.
- Create a new personal list inline.
- Check and uncheck personal lists dynamically, updating the `selectedListIds` local state.
- Save the selections by upserting rows into `list_restaurants` with `onConflict: 'list_id,restaurant_id'` and `ignoreDuplicates: true`.
- Trigger success haptic feedback and display a "Saved!" alert upon completion.

### 6.6 Your Lists — `app/(tabs)/lists.tsx`

This tab fetches on focus:

- current user's `lists` rows ordered oldest first;
- an exact count of current user's `reviews` for the virtual Been row.

The Been row routes with ID `been`. Personal list rows route using their UUID. New-list creation only asks for a title and inserts:

```text
list_type: personal
source_type: manual
owner_id: current user ID
```

Descriptions and cover images are edited later from list detail. The screen has loading and empty states but does not show fetch errors.
- **List Search & Filtering**: Features an animated header search toggled via a search icon. When active, it displays a slide-in search input letting users filter lists by title locally. While searching, the virtual "Been" list is hidden.

### 6.7 List detail — `app/list/[id].tsx`

This route handles three list types based on the URL value:

- `been`: virtual list generated from the user's reviews;
- UUID: personal database list queried by `lists.id`;
- other short string: curated database list queried by `lists.slug`.

For normal lists, metadata and contents load in parallel. Contents come from RPC:

```text
get_list_items(p_list_identifier: id-or-slug)
```

The RPC is expected to return restaurant ID, name, area, primary photo, rank, score, venue type, price level, and opening hours. An in-memory module-level `Map` caches metadata/items by identifier; cached data renders immediately and refreshes silently.

The Been list queries the user's reviews, embeds restaurant fields, and sorts by `final_score`. Its ascending/descending control refetches from Supabase.

Other features:

- **List progress tracking**: Displays a progress track bar showing "You've been to X of Y places" (where X is the count of reviewed restaurants with a non-null score, and Y is the total list items).
- **Add Restaurant button**: For personal/manual lists, displays an "Add" button routing to the Search tab (`/(tabs)/search`) with parameter `addToList: id` to let users find and append restaurants.
- **Slide-up edit sheet**: The edit list modal displays as a bottom slide-up sheet with rounded corners and a drag handle to match standard UI patterns.
- “Open now” filtering parses today's Google-style `opening_hours` lines locally.
- Restaurant rows route to restaurant detail.
- Personal/normal list menu offers edit, share, and delete.
- Edit supports title, subtitle, and 16:9 cover from camera/library.
- Covers upload to public `list_covers/{userId}/{timestamp}.{ext}`.
- Share currently sends plain text only, with no deep link.
- City filter and map view are explicit “Coming soon” alerts.

Important list-detail caveats:

- Edit/delete controls are shown for every non-Been list, including curated slugs. RLS may block writes, but the UI does not check ownership or curated status.
- Delete uses `.eq('id', id)`, so it is only meaningful for UUID lists.
- Opening-hours parsing assumes a specific English text format and handles overnight hours as unknown rather than correctly computing them.
- RPC and metadata errors are ignored; missing data can leave the page in a weak/empty state.
- Uploaded cover objects are not cleaned up when replaced or removed.

### 6.8 Leaderboard — [leaderboard.tsx](file:///D:/mobile-app/kori/app/(tabs)/leaderboard.tsx)

The Leaderboard screen displays rankings for foodies and restaurants. It is fully integrated and has:

- Segmented Foodies/Restaurants modes.
- Global or area scope picker (ScopePicker).
- Top-three podium (Podium) with medal rings (gold, silver, bronze). Tapping a user card navigates to `/profile/[username]`.
- Remaining ranked rows (LeaderboardRow). Tapping a row navigates to `/profile/[username]` (for foodies) or `/restaurant/[id]` (for restaurants).
- Pull-to-refresh, loading, empty, and error states.
- Shared green theme constants in `lib/leaderboard-theme.ts` (using iOS green `#34C759` for text and badge styles).
- **Header & Safe Area Polishing**: The screen uses `useSafeAreaInsets` to add spacing to the header and safe padding to the bottom of the list content. Replaced `SafeAreaView` with a flex container and locked status bar styling to `dark` to maintain visibility on all platforms.

Data comes from `hooks/useLeaderboard.tsx`, limited to 50 rows:

- `foodie_leaderboard_global`
- `foodie_leaderboard_by_area`
- `restaurant_leaderboard`

Area choices are derived dynamically from distinct non-empty `restaurants.area` values. Both underlying leaderboard hooks are always called to obey React hook rules, but the inactive hook receives `null` and performs no request.

Foodie fields: user ID, name, avatar, points, level, active streak weeks, and rank. Restaurant fields: restaurant ID, name, area, venue type, photo, algorithm score, raw review count, and global/area ranks.

No current-user highlighting is passed to the row in the screen, even though `LeaderboardRow` accepts `isCurrentUser`.

### 6.9 Profile — [my-list.tsx](file:///D:/mobile-app/kori/app/(tabs)/my-list.tsx)

The Profile tab fetches the authenticated user's profile and gamification stats. It shows:

- Header displaying `@username` if configured (otherwise defaults to full name) and a Settings button (hamburger icon) opening a settings slide-up modal.
- User avatar (renders `avatar_url` with a fallback initial-based avatar).
- Full name and username (`@username`), along with bio details. If bio is empty, a prompt "Add a bio →" is displayed.
- Quick actions: Edit Profile (navigates to `/profile/edit`) and Share Profile (shares level and global rank summary including username handle).
- Stats card: review count, average review score, and global leaderboard rank.
- Gamification level progress card: current level, total XP, pending live XP indicator, progress bar, and XP remaining to next level.
- Achievement progress card: interactive SVG concentric circular progress rings (Scout, Paparazzi, Critic) with counts and thresholds, plus a details info popup.
- “My rankings” list with restaurant, area, dishes, and score. Each review row is tappable to navigate to `/restaurant/[id]`.
- Settings sheet/modal containing account actions, privacy/support links, log out (with confirmation alert), and delete account.
- Pull-to-refresh.

Profile watches the global `reviewCount` state from `ReviewContext`. When a review is submitted and `reviewCount` increments, it triggers `loadData()` to pull server-refreshed levels and stats.

### 6.9a Public Profile — [[username].tsx](file:///D:/mobile-app/kori/app/profile/[username].tsx)

A read-only profile page showcasing another user's progress:
- Route: `/profile/[username]`, case-insensitive lookup on username handle using Postgres `ilike`.
- Shows: user avatar, full name, `@username`, bio, level progress card, stats card, achievements card, and their submitted review list (newest first).
- Renders an appropriate empty state if the profile is not found or is set to private (`is_public = false`).

### 6.10 Profile Edit — `app/profile/edit.tsx`

A standalone screen for updating user profiles. Features:

- Text fields to edit the user's full name, username, and bio (multiline, up to 100 characters with live character counter);
- Real-time debounced (450ms) Postgres check to verify username availability (ensuring 3–20 alphanumeric/underscore characters);
- Validation ensuring the save action is disabled unless a valid, available (or unchanged) username is supplied;
- Ability to change/upload profile photo (uses `expo-image-picker` to pick from the photo library, cropped to 1:1, quality 0.8);
- Photo upload flow: reads chosen image, converts it to base64, decodes base64 into an ArrayBuffer, and uploads to the public bucket `avatars` on Supabase Storage under `{userId}/profile.{ext}`;
- Inline loading and saving indicators.

## 7. Supabase contract inferred from client code

This schema is inferred from queries, not from migrations (no SQL/migration directory is present in this snapshot).

### Tables

*(Refer to Section 16/supabase everything below for exact local table definitions)*

### Views

- `foodie_leaderboard_global`
- `foodie_leaderboard_by_area` (includes `area`)
- `restaurant_leaderboard` (includes both `global_rank` and `area_rank`)

### RPC

- `get_list_items(p_list_identifier)` accepts either list UUID or curated slug.

### Generated Columns

The following column is automatically computed by Postgres. **Do NOT write to this field from the client application**:
- **`reviews.final_score`**: Generated by the database as `((food_score + ambiance_score + presentation_score) / 3.0)`. The client inserts component scores only; never attempt to write `final_score` directly.

### Storage buckets

- `banners` — public Home banner assets
- `food_photos` — review photos
- `list_covers` — user list cover images
- `avatars` — user profile avatar images

### Row Level Security (RLS) Policies

These policies are configured in the remote Supabase database instance:

| Table | Policy Name | Command | Roles | Condition (using / with_check) |
|---|---|---|---|---|
| **profiles** | Public Profiles are viewable by everyone | `SELECT` | public | `true` |
| | Users can update own profile | `UPDATE` | public | `auth.uid() = id` |
| **restaurants** | Restaurants are viewable by everyone | `SELECT` | public | `true` |
| | Authenticated users can insert restaurants | `INSERT` | public | `auth.role() = 'authenticated'::text` |
| **reviews** | Reviews are viewable by everyone | `SELECT` | public | `true` |
| | Users can insert their own reviews | `INSERT` | public | `auth.uid() = user_id` |
| | Users can update their own reviews | `UPDATE` | public | `auth.uid() = user_id` |
| | Users can delete their own reviews | `DELETE` | public | `auth.uid() = user_id` |
| **lists** | Public lists are viewable by everyone | `SELECT` | public | `is_public = true OR auth.uid() = owner_id` |
| | Users can insert their own personal lists | `INSERT` | public | `list_type = 'personal'::text AND auth.uid() = owner_id` |
| | Users can update their own lists | `UPDATE` | public | `auth.uid() = owner_id` |
| | Users can delete their own lists | `DELETE` | public | `auth.uid() = owner_id` |
| **list_restaurants** | List items are viewable if list is viewable | `SELECT` | public | `EXISTS (SELECT 1 FROM lists l WHERE l.id = list_id AND (l.is_public = true OR l.owner_id = auth.uid()))` |
| | Users can add to their own personal lists | `INSERT` | public | `EXISTS (SELECT 1 FROM lists l WHERE l.id = list_id AND l.owner_id = auth.uid() AND l.list_type = 'personal'::text)` |
| | Users can remove from their own lists | `DELETE` | public | `EXISTS (SELECT 1 FROM lists l WHERE l.id = list_id AND l.owner_id = auth.uid())` |

Database triggers, constraints, and view/RPC definitions are not present in migration files locally. Refer to the table above and Section 16 for database schemas.

## 8. UI and design language

Primary brand colors used across most screens:

```text
Mint accent:       #acfae0 (used as active indicator in tabs)
Deep green:        #065F46
Wired Ink (Active):#000000 (tab active icon/text color)
Main text:         #111827
Muted text:        #6b7280 / #9ca3af / #6e6e73
Light borders:     #e5e7eb / #f3f4f6 / #e0e0e0
```

The leaderboard separately uses iOS green `#34C759`. The visual style uses white surfaces, large rounded corners, bold/black typography, subtle gray borders, pill controls, image cards, haptics, and compact animations. Many styles are duplicated locally rather than coming from a unified design-system file. `constants/theme.ts` and starter themed components exist but the main product screens mostly do not use them.

The app name is inconsistent: package/config says `kori`, while visible UI and text say `kuri`. Confirm the intended spelling before global renaming.

## 9. Assets

- `assets/icons/`: paired active/inactive category icons for food, coffee, pizza, and dining.
- `assets/animations/eat.json`: Home decorative animation.
- `assets/animations/suc.json`: review success animation currently used.
- Additional `Success.json`, `Success.lottie`, and `review.mp3` exist but are not clearly used by current screens.
- `assets/images/`: Expo starter images plus app/splash/adaptive icons.
- Home banners are remote and not stored in the repository.

## 10. State, caching, and data refresh behavior

- Auth: Supabase session persisted in AsyncStorage and observed globally.
- Home banners: eagerly prefetched through `expo-image`.
- Recent searches: AsyncStorage, maximum five strings.
- List library: refetches whenever its tab gains focus, without full-screen loading after the first fetch.
- List detail: module-level in-memory stale-while-refresh cache; lost on app reload.
- Restaurant detail: fetches on route ID change and prepends a newly submitted review locally.
- Leaderboard: hook state with explicit pull-to-refresh, no persistent cache or pagination beyond 50 rows.
- Profile: initial fetch plus pull-to-refresh.

There is no general data-fetching/cache framework such as TanStack Query, no global state library, and no generated Supabase TypeScript types.

### 10.1 Realtime Architecture

To ensure live updates across clients, the **Restaurant Detail** screen (`app/restaurant/[id].tsx`) subscribes to Realtime updates for reviews of the displayed restaurant:
- **Table**: `reviews`
- **Event**: `INSERT`
- **Filter**: `restaurant_id = eq.{restaurantId}`

**Realtime Subscription Flow:**
```
ReviewModal (Submit Review)
    ↓
INSERT new review row into public.reviews
    ↓
Supabase Realtime Engine (Pub/Sub)
    ↓
RestaurantDetail Screen (receives INSERT payload)
    ↓
fetchRestaurantData(true) (silent background refresh)
    ↓
UI updates (displays new review + updates score averages)
```
*Note: Realtime channels are cleanly unsubscribed/closed when the screen unmounts.*

### 10.2 Database Refresh Strategy (Materialized Views & pg_cron)

All user levels, stats, and restaurant ranking scores are computed asynchronously on the database server to optimize performance and prevent cheating. **The client application never recalculates these values.**

Instead, the database utilizes `pg_cron` to refresh the following Materialized Views:
- **`restaurant_rankings`**:
  - *Refresh Schedule*: Every hour, on the hour (`0 * * * *` via `refresh-restaurant-rankings`).
  - *Used by*: Live search results (Top Rated) and restaurant leaderboards.
- **`user_gamification_stats`**:
  - *Refresh Schedule*: Every hour, at 5 minutes past (`5 * * * *` via `refresh-user-gamification`).
  - *Used by*: Global foodie leaderboards and profile level/XP computations.
- **`user_area_leaderboards`**:
  - *Refresh Schedule*: Every hour, at 5 minutes past (`5 * * * *` via `refresh-user-gamification`).
  - *Used by*: Foodie leaderboards filtered by area.

### 10.3 Realtime & Event Flow

This section details how Supabase Realtime, `ReviewContext`, materialized views, and client-side background polling orchestrate to handle state synchronization during key runtime events:

#### A. Review Submission & Gamification Flow (Synchronous + Asynchronous)
1. **Submit Action**: The user fills out the review form in `ReviewModal` (component scores, note, photos) and submits it.
2. **Database Insert**: The client inserts the new row into `public.reviews` and links lists in `public.list_restaurants`.
3. **Context Event Trigger**: On successful inserts, `ReviewModal` invokes `notifyReviewSubmitted` on `ReviewContext`:
   - It runs a local check `checkIsPioneer` (queries `reviews` count prior to current timestamp; if < 5, sets `isPioneer = true`).
   - It calculates the review's estimated XP: `10` (base) + `min(dishCount*2, 6)` + `3` (notes) + `5` (photo) + `15` (if pioneer).
   - It multiplies the XP by the user's active streak multiplier (e.g. `1.2` if streak >= 2 weeks).
4. **Instant Client-Side Feedback**:
   - **Level Up**: If the computed points push the user past a level threshold (calculated using `getLevel` from `lib/gamification` against the stored `baselineRef`), `ReviewContext` triggers a delayed (1800ms) full-screen `LevelUpModal` celebration, overlaying whatever screen is active.
   - **Badge Level Toast**: If a badge level is unlocked, `ReviewContext` triggers a delayed (2000ms) slide-down `AchievementToast` banner overlaying whatever screen is active.
   - **Data Reload Trigger**: `ReviewContext` increments its stateful `reviewCount`. The Profile screen (`my-list.tsx`) watches `reviewCount` via `useEffect` and calls `loadData()` to fetch the updated profile metrics.
   - **Refreshed Baseline**: Once `loadData()` completes, it calls `updateBaseline` in `ReviewContext` to align the local baseline with the server's state.
5. **Backend Database Refresh (pg_cron)**: 
   - Meanwhile, on the server, the new review row exists, but ranks and global scores are not calculated yet.
   - Within the hour, `pg_cron` runs, concurrently refreshing `restaurant_rankings`, `user_gamification_stats`, and `user_area_leaderboards` to consolidate ranks and points globally.

#### B. Restaurant Detail Refresh Flow (Realtime + Polling)
1. **Channel Subscription**: When `RestaurantDetailScreen` (`app/restaurant/[id].tsx`) mounts, it opens a Supabase Realtime channel listening for review `INSERT` events matching the current `restaurant_id`.
2. **Third-Party Review Update**:
   - When *another* user submits a review, the server broadcasts an event.
   - `RestaurantDetailScreen` receives the event and triggers `fetchRestaurantData(true)` to silently reload reviews and averages.
3. **Current User Submission**:
   - If the *current* user submits a review, the modal closes and invokes `onSubmitSuccess`.
   - The screen instantly expands the accordion (`isMyReviewExpanded = true`).
   - Rather than waiting for the Realtime broadcast, the screen runs `fetchRestaurantData(true)` immediately, and schedules two additional background fetches at 800ms and 1600ms to poll the database, bridging any processing/write latency so the UI renders the new review cleanly.
4. **Channel Teardown**: Upon screen unmount, the Realtime channel is explicitly closed.

## 11. Known incomplete or risky areas

High-priority items to verify before extending the app:

1. [RESOLVED] Review success callback/state closure and incomplete inserted-row selection (now handled via `ReviewContext` global provider, polling database updates in `restaurant/[id].tsx` upon submission, and selecting all fields in `ReviewModal.tsx`).
2. Ownership gating for edit/delete on curated lists.
3. Auth protection for deep-linked list and restaurant routes.
4. Missing error handling on most Supabase reads.
5. No checked-in database schema, triggers, or leaderboard view definitions (note: RLS policies are now cataloged in Section 7).
6. No automated tests and no test script.
7. [RESOLVED] Client-side averages can become expensive because browse queries embed all review scores (now migrated to the restaurant_rankings materialized view).
8. Search depends on an English `search_vector`; restaurant names/local language behavior is unknown.
9. Public uploads have no cleanup lifecycle.
10. Hard-coded Surat wording, category data, and colors reduce configurability (though home cards and banners are now dynamic via `home_cards` table in Supabase).
11. Home notification/profile buttons and City filter are not implemented (though a hero Mapbox vector MapView is implemented on restaurant detail, and restaurant bookmarking/profile navigation from leaderboards are fully implemented).
12. Duplicate component filenames differing only by case may cause cross-platform/version-control confusion (e.g., `components/HapticTab.tsx` and `components/haptic-tab.tsx`).
13. Some source comments/text show encoding artifacts when read in the current shell; verify actual UTF-8 rendering before editing currency symbols, bullets, emoji, or dashes.
14. There is no pagination for reviews, personal lists, list contents, or profile rankings.
15. Root loading renders `null`; there is no branded splash/loading/error recovery around session initialization.

## 12. Current working-tree state

The working tree has active modifications including:
- **Tab Layout Redesign**: Re-engineered `app/(tabs)/_layout.tsx` to match the "Wired" aesthetic (white canvas bar, pure black active icons, mint active top bar indicator, labels hidden, and reordered tabs).
- **Home Feed Redesign**: Upgraded review feed cards in `app/(tabs)/index.tsx` to Apple Store-style layouts (18px border radius, white background, `#e0e0e0` grey border, 44x44 circular reviewer avatars, dynamic score badges, and bottom spacing).
- **Leaderboard Safe Insets**: Adjusted header margins and list padding dynamically using `useSafeAreaInsets` in `app/(tabs)/leaderboard.tsx` and locked the status bar to `dark` for cross-platform visual safety.
- **Lists Search Integration**: Added local name search/filtering inside `app/(tabs)/lists.tsx` using an animated header search toggled by an icon, hiding the virtual "Been" list during query filtering.

The previous implementations successfully resolved:
- **Mapbox Integration**: Refactored the restaurant detail screen to use `@rnmapbox/maps` and set up Android/iOS scripts for native compilation.
- **Dynamic home cards**: Migrated category carousels from static JSON lists to dynamic Postgres `home_cards` table fetch.
- **Gamification Event Bridge**: Designed a global event bus in `ReviewContext` that triggers full-screen `LevelUpModal` and `AchievementToast` slide-down alerts on XP changes.
- **Leaderboard Navigation**: Enabled tapping any leaderboard row or podium avatar/card to navigate directly to the user's public profile `app/profile/[username].tsx` or restaurant detail screen.
- **SaveToListModal**: Integrated a standard bottom-sheet selection modal to manage bookmarks on personal lists dynamically.
- **Lint error cleanup**: Resolved unescaped entity errors (`react/no-unescaped-entities`) and optimized dependency arrays for `useEffect` and `useMemo` hooks across all app tabs.

## 13. File ownership map

Core files a new AI is most likely to edit:

| Concern | Files |
|---|---|
| Auth/session routing | `app/_layout.tsx`, `app/auth.tsx`, `lib/supabase.ts` |
| Tabs | `app/(tabs)/_layout.tsx`, `components/HapticTab.tsx` |
| Home curation | `app/(tabs)/index.tsx` |
| Restaurant discovery | `app/(tabs)/search.tsx` |
| Restaurant and reviews | `app/restaurant/[id].tsx`, `components/ReviewModal.tsx`, `components/SaveToListModal.tsx`, `context/ReviewContext.tsx` |
| Personal/curated lists | `app/(tabs)/lists.tsx`, `app/list/[id].tsx` |
| Profile & Edit profile | `app/(tabs)/my-list.tsx`, `app/profile/edit.tsx` |
| Leaderboard | `app/(tabs)/leaderboard.tsx`, `components/leaderboard/*`, `hooks/useLeaderboard.tsx`, `lib/leaderboard-*` |
| Native/app config | `app.json`, `package.json` |

Most starter components (`hello-wave`, `parallax-scroll-view`, themed wrappers, collapsible, icon-symbol, external-link) are not central to the current product.

## 14. Recommended workflow for the next AI

1. Read this file, `AGENTS.md`, `package.json`, and the exact Expo SDK 54 docs.
2. Run `git status --short` and inspect relevant diffs.
3. Open the specific screen plus every local component/hook it imports.
4. If the task touches data, obtain the actual Supabase schema/RLS/RPC/view definition.
5. Make the smallest scoped change; preserve existing design conventions and user changes.
6. Run `npm run lint` and relevant Expo/platform checks.
7. Test authentication and both loading/error/empty/success paths on the affected screen.
8. State exactly what changed, what was verified, and any database or device testing still required.

## 15. Compact prompt to give another AI

```text
You are working on Kori/Kuri, an Expo SDK 54 + React Native 0.81 + Expo Router 6 restaurant-ranking app backed by Supabase with Mapbox mapping. Read AI_PROJECT_HANDOFF.md and AGENTS.md completely before acting. Before writing code, use only the exact Expo v54 docs at https://docs.expo.dev/versions/v54.0.0/. Never expose .env values. Inspect the actual Supabase schema before assuming RLS, triggers, views, or RPC behavior. Follow the current mint/deep-green/leaderboard-green rounded mobile UI unless the task says otherwise. After changes, run lint and report device/database verification gaps.
```

## 16. Snapshot limitations

This document summarizes the checked-out client repository only. It does not include the remote Supabase schema, RLS policies, Edge Functions, analytics, deployment state, EAS secrets, store configuration, product requirements, or design source files. Treat database statements above as client-observed contracts until confirmed against the live project.


## 17. Elo & Visits Refactoring Plan (Pending Implementation)

A complete redesign of the backend ranking algorithm is planned (context provided in `backend.md`). The client application needs to be updated to transition from the old **Reviews & Scores** (1-10 food, ambiance, presentation) system to an **Elo-Based Visits & Comparisons** system.

### 17.1 Database Changes
- **New Tables**:
  - `visits`: Entry point. One row per user per restaurant. Stores: user_id, restaurant_id, sentiment, notes, photo_url, dish_names.
  - `user_rankings`: Personal ordered list. Stores: user_id, restaurant_id, category, sentiment_tier, rank_position.
  - `ranking_comparisons`: History of comparisons. Stores: user_id, winner_id, loser_id, category, sentiment.
  - `restaurant_elo`: Community Elo scores. Stores: restaurant_id, elo_score, comparison_count, unique_users.
- **New Functions**:
  - `record_comparison(user_id, winner_id, loser_id, category, sentiment)`: Called for each comparison. If sentiment is 'loved', triggers `update_elo()`.
  - `update_elo(winner_id, loser_id, category, user_id)`: Asynchronously computes expected scores and adjusts Elo scores for both restaurants.
  - `place_restaurant_ranking(user_id, restaurant_id, category, sentiment, position)`: Inserts a restaurant at `position` in `user_rankings`, shifting existing ones down.
- **Updated Views & Functions**:
  - `restaurant_leaderboard` view: Reads from `restaurant_elo` and normalizes ELO to a 1-10 display score using `PERCENT_RANK` (partitioned by category, requiring 5+ comparisons from 3+ unique users).
  - `get_list_items()` RPC: Updated to retrieve scores from `restaurant_elo` instead of `restaurant_rankings`.
  - `delete_user_account()` function: Updated to cascade delete from `visits`, `user_rankings`, and `ranking_comparisons`.

### 17.2 Client-Side Code Updates Needed
1. **Restaurant Detail (`app/restaurant/[id].tsx`)**:
   - Fetch community visits from `visits` (embedding visitor profiles) instead of `reviews`.
   - Update Kori score badge to display the normalized Elo score from `restaurant_leaderboard`.
   - Change community review feed cards to render visit sentiment tier (Loved it / Liked it / Not Good), notes, and dishes.
   - Sticky button "Rate this place" -> "I've been here".
   - Subscribes to Supabase Realtime changes on the `visits` table instead of `reviews`.
2. **Review Modal / Visit Flow (`components/ReviewModal.tsx`)**:
   - Replace the three 1-10 component sliders (food, ambiance, presentation) with a Sentiment Selection component (Loved it / Liked it / Not Good).
   - Maintain note inputs, dish names tags input, and photo upload.
   - On submit, insert into the `visits` table instead of `reviews`.
   - **Binary Search flow (Loved sentiment)**:
     - If the user selects "Loved it", fetch the user's current ranked list (`user_rankings` ordered by `rank_position`).
     - Prompt the user with a sequence of A-vs-B comparisons to binary search the position of the new restaurant against existing loved restaurants.
     - Call `record_comparison()` on each comparison decision.
     - Call `place_restaurant_ranking(position)` once the final rank position is found.
     - Display the result (e.g. "Roman Dine ranked #2, right behind Honest, just ahead of Zaika").
3. **Your Lists (`app/(tabs)/lists.tsx`) & List Detail (`app/list/[id].tsx`)**:
   - Update the Been list queries to count and fetch from `visits` instead of `reviews`.
4. **Leaderboard (`app/(tabs)/leaderboard.tsx`)**:
   - Ensure the restaurant leaderboard tab fetches from the updated `restaurant_leaderboard` view (displaying normalized Elo 1-10 rating).
5. **Profile (`app/(tabs)/my-list.tsx`)**:
   - Stats card: show visit count and average Elo/rank instead of review count and average score.
   - "My rankings": list the user's personal rankings from `user_rankings`.
6. **Context (`context/ReviewContext.tsx`)**:
   - Refactor context events (`notifyReviewSubmitted` -> `notifyVisitSubmitted`) and adjust estimated gamification XP calculations to follow the new rules (base visit: 10, dishes: +2 up to 6, notes: +3, photo: +5, pioneer: +15, comparison: +5).


supabase everything

-- ====================================================================================
-- KURI CORE RANKING ALGORITHM (Advanced Continuous Curves)
-- This script creates a Materialized View that calculates the definitive algorithmic
-- score for every restaurant, neutralizing human bias and malicious attacks.
-- ====================================================================================

DROP VIEW IF EXISTS public.global_leaderboard CASCADE;
DROP MATERIALIZED VIEW IF EXISTS public.restaurant_rankings CASCADE;
DROP MATERIALIZED VIEW IF EXISTS public.leaderboard_analytics CASCADE;

-- ═══════════════════════════════════════════════════════════
-- 1. THE MATERIALIZED VIEW — the whole algorithm lives here
-- ═══════════════════════════════════════════════════════════
CREATE MATERIALIZED VIEW public.restaurant_rankings AS

WITH

-- Each user's raw mean/stddev across their own reviews.
user_raw_stats AS (
  SELECT
    user_id,
    AVG(final_score)                       AS raw_mean,
    COALESCE(STDDEV_SAMP(final_score), 0)  AS raw_stddev,
    COUNT(*)                               AS review_count
  FROM public.reviews
  GROUP BY user_id
),

-- Platform-wide mean/stddev — used to rescale z-scores back to 1-10.
global_stats AS (
  SELECT
    AVG(final_score)                       AS global_mean,
    COALESCE(STDDEV_SAMP(final_score), 1)  AS global_stddev
  FROM public.reviews
),

-- Shrink each user's personal mean/stddev toward the global numbers
user_calibrated_stats AS (
  SELECT
    u.user_id,
    (u.review_count * u.raw_mean + 5 * g.global_mean) / (u.review_count + 5) AS calibrated_mean,
    GREATEST(
      0.5,
      (u.review_count * u.raw_stddev + 5 * g.global_stddev) / (u.review_count + 5)
    ) AS calibrated_stddev
  FROM user_raw_stats u
  CROSS JOIN global_stats g
),

-- Burst-detection signal.
review_burst_counts AS (
  SELECT
    r1.id AS review_id,
    COUNT(r2.id) AS same_day_count
  FROM public.reviews r1
  JOIN public.reviews r2
    ON r2.restaurant_id = r1.restaurant_id
    AND r2.created_at <= r1.created_at
    AND r2.created_at > r1.created_at - INTERVAL '24 hours'
  GROUP BY r1.id
),

-- Per-review: calibrated score and the combined weight.
review_weights AS (
  SELECT
    rev.id,
    rev.restaurant_id,

    -- Z-score rescaled onto the global scale, clamped to 1-10.
    LEAST(10, GREATEST(1,
      g.global_mean +
      ((rev.final_score - ucs.calibrated_mean) / ucs.calibrated_stddev) * g.global_stddev
    )) AS calibrated_score,

    -- Recency decay — ~1 year half-life
    EXP(-0.0019 * EXTRACT(DAY FROM NOW() - rev.created_at)) AS recency_weight,

    -- Smooth trust ramp 
    LEAST(1.5,
      0.02 + 1.48 * (1 - EXP(-(COALESCE(u.review_count, 1) - 1) / 2.5))
    ) AS trust_weight,

    -- Burst penalty
    CASE WHEN COALESCE(rb.same_day_count, 1) > 8 THEN 0.1 ELSE 1.0 END AS anomaly_weight

  FROM public.reviews rev
  JOIN user_calibrated_stats ucs ON ucs.user_id = rev.user_id
  LEFT JOIN user_raw_stats u ON u.user_id = rev.user_id
  LEFT JOIN review_burst_counts rb ON rb.review_id = rev.id
  CROSS JOIN global_stats g -- [FIXED]: Added missing JOIN to global_stats
),

-- Raw weighted average per restaurant
restaurant_raw AS (
  SELECT
    restaurant_id,
    SUM(calibrated_score * recency_weight * trust_weight * anomaly_weight)
      / NULLIF(SUM(recency_weight * trust_weight * anomaly_weight), 0) AS restaurant_avg,
    SUM(recency_weight * trust_weight * anomaly_weight)      AS effective_review_count,
    COUNT(*)                                                 AS raw_review_count
  FROM review_weights
  GROUP BY restaurant_id
),

-- Category (venue_type) average
category_stats AS (
  SELECT
    r.venue_type,
    AVG(rr.restaurant_avg) AS category_avg,
    COUNT(*)               AS restaurants_in_category
  FROM restaurant_raw rr
  JOIN public.restaurants r ON r.id = rr.restaurant_id
  GROUP BY r.venue_type
),

global_fallback AS (
  SELECT AVG(restaurant_avg) AS overall_avg FROM restaurant_raw
)

-- Final assembly: Bayesian shrinkage + Logarithmic volume bonus
SELECT
  r.id          AS restaurant_id,
  r.name,
  r.area,
  r.venue_type,
  ROUND(rr.restaurant_avg::numeric, 2)         AS simple_average_score,
  rr.raw_review_count,
  ROUND(rr.effective_review_count::numeric, 2) AS effective_review_count,

  ROUND(
    LEAST(10, GREATEST(1,
      (5 * COALESCE(
          CASE WHEN cs.restaurants_in_category >= 3 THEN cs.category_avg END,
          gf.overall_avg
        )
        + rr.effective_review_count * rr.restaurant_avg
      ) / NULLIF((5 + rr.effective_review_count), 0)
      + (LOG(10, GREATEST(rr.effective_review_count + 1, 1)) * 0.1)
    ))::numeric, 2
  ) AS algorithm_score

FROM restaurant_raw rr
JOIN public.restaurants r ON r.id = rr.restaurant_id
LEFT JOIN category_stats cs ON cs.venue_type = r.venue_type
CROSS JOIN global_fallback gf;

-- Required for concurrent (non-locking) refreshes
CREATE UNIQUE INDEX restaurant_rankings_id_idx
  ON public.restaurant_rankings(restaurant_id);


-- ═══════════════════════════════════════════════════════════
-- 2. SCHEDULE THE HOURLY REFRESH
-- ═══════════════════════════════════════════════════════════
CREATE EXTENSION IF NOT EXISTS pg_cron;

SELECT cron.schedule(
  'refresh-restaurant-rankings',
  '0 * * * *',  -- every hour, on the hour
  $$ REFRESH MATERIALIZED VIEW CONCURRENTLY public.restaurant_rankings; $$
);

-- ═══════════════════════════════════════════════════════════
-- 3. POINT get_list_items AT THE NEW PIPELINE
-- ═══════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION public.get_list_items(p_list_id uuid)
RETURNS TABLE (
  restaurant_id uuid, name text, area text, primary_photo_url text,
  rank int, score numeric, venue_type text, price_level integer, opening_hours jsonb
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_type text;
  v_filter jsonb;
BEGIN
  SELECT source_type, source_filter INTO v_type, v_filter
  FROM public.lists WHERE id = p_list_id;

  IF v_type = 'leaderboard' THEN
    RETURN QUERY
      SELECT rr.restaurant_id, rr.name, rr.area, r.primary_photo_url,
             row_number() OVER (ORDER BY rr.algorithm_score DESC)::int,
             rr.algorithm_score, rr.venue_type, r.price_level, r.opening_hours
      FROM public.restaurant_rankings rr
      JOIN public.restaurants r ON r.id = rr.restaurant_id
      WHERE rr.raw_review_count >= COALESCE((v_filter->>'min_reviews')::int, 0)
      ORDER BY rr.algorithm_score DESC
      LIMIT COALESCE((v_filter->>'limit')::int, 50);

  ELSIF v_type = 'dish_tag' THEN
    RETURN QUERY
      SELECT r.id, r.name, r.area, r.primary_photo_url,
             row_number() OVER (ORDER BY avg(rev.final_score) DESC)::int,
             avg(rev.final_score), r.venue_type, r.price_level, r.opening_hours
      FROM public.reviews rev
      JOIN public.restaurants r ON r.id = rev.restaurant_id
      WHERE (v_filter->>'dish') = ANY(rev.dish_names)
      GROUP BY r.id, r.name, r.area, r.primary_photo_url, r.venue_type, r.price_level, r.opening_hours
      HAVING COUNT(*) >= COALESCE((v_filter->>'min_reviews')::int, 1)
      ORDER BY 5 DESC
      LIMIT COALESCE((v_filter->>'limit')::int, 20);

  ELSE
    RETURN QUERY
      SELECT lr.restaurant_id, r.name, r.area, r.primary_photo_url, lr.rank,
             (SELECT avg(rev.final_score) FROM public.reviews rev WHERE rev.restaurant_id = r.id),
             r.venue_type, r.price_level, r.opening_hours
      FROM public.list_restaurants lr
      JOIN public.restaurants r ON r.id = lr.restaurant_id
      WHERE lr.list_id = p_list_id
      ORDER BY lr.rank NULLS LAST;
  END IF;
END;
$$;



-- ====================================================================================
-- KURI USER GAMIFICATION & LEADERBOARD SYSTEM (FINAL, COMBINED)
-- ====================================================================================

DROP MATERIALIZED VIEW IF EXISTS public.user_area_leaderboards CASCADE;
DROP MATERIALIZED VIEW IF EXISTS public.user_gamification_stats CASCADE;

-- ═══════════════════════════════════════════════════════════
-- 1. USER GAMIFICATION STATS
-- ═══════════════════════════════════════════════════════════
CREATE MATERIALIZED VIEW public.user_gamification_stats AS

WITH
review_chronology AS (
  SELECT
    id AS review_id, user_id, restaurant_id, created_at,
    dish_names, notes, photo_url,
    ROW_NUMBER() OVER (PARTITION BY restaurant_id ORDER BY created_at ASC) AS chronological_rank
  FROM public.reviews
),

review_points AS (
  SELECT
    review_id, user_id, restaurant_id, created_at,
    10 AS base_pts,
    LEAST(COALESCE(array_length(dish_names, 1), 0) * 2, 6) AS tag_pts,
    CASE WHEN NULLIF(trim(notes), '') IS NOT NULL THEN 3 ELSE 0 END AS note_pts,
    CASE WHEN photo_url IS NOT NULL THEN 5 ELSE 0 END AS photo_pts,
    CASE WHEN chronological_rank <= 5 THEN 15 ELSE 0 END AS pioneer_pts
  FROM review_chronology
),

user_weeks AS (
  SELECT DISTINCT user_id, date_trunc('week', created_at)::date AS review_week
  FROM public.reviews
),

streak_groups AS (
  SELECT
    user_id, review_week,
    review_week - (DENSE_RANK() OVER (PARTITION BY user_id ORDER BY review_week) * 7)::int AS streak_group
  FROM user_weeks
),

active_streaks AS (
  SELECT user_id, COUNT(*) AS current_streak_weeks
  FROM streak_groups
  GROUP BY user_id, streak_group
  HAVING MAX(review_week) >= date_trunc('week', now() - interval '1 week')::date
),

-- No join to restaurants needed anymore — street_food_king (the only thing
-- that needed venue_type) has been removed.
user_aggregates AS (
  SELECT
    rp.user_id,
    SUM(base_pts + tag_pts + note_pts + photo_pts + pioneer_pts) AS lifetime_points,
    COUNT(CASE WHEN pioneer_pts > 0 THEN 1 END) AS total_pioneers,
    COUNT(DISTINCT CASE WHEN photo_pts > 0 THEN rp.restaurant_id END) AS unique_photo_venues,
    COUNT(CASE WHEN note_pts > 0 THEN 1 END) AS total_notes_written
  FROM review_points rp
  GROUP BY rp.user_id
)

SELECT
  ua.user_id,
  COALESCE(ua.lifetime_points, 0) AS lifetime_points,
  COALESCE(st.current_streak_weeks, 0) AS active_streak_weeks,
  CASE WHEN COALESCE(st.current_streak_weeks, 0) >= 2 THEN 1.2 ELSE 1.0 END AS active_streak_multiplier,

  CASE
    WHEN ua.lifetime_points >= 20000 THEN 50
    WHEN ua.lifetime_points >= 5000 THEN 25
    WHEN ua.lifetime_points >= 1000 THEN 10
    WHEN ua.lifetime_points >= 300 THEN 5
    WHEN ua.lifetime_points >= 50 THEN 2
    ELSE 1
  END AS user_level,

  CASE
    WHEN ua.lifetime_points >= 20000 THEN 20000
    WHEN ua.lifetime_points >= 5000 THEN 5000
    WHEN ua.lifetime_points >= 1000 THEN 1000
    WHEN ua.lifetime_points >= 300 THEN 300
    WHEN ua.lifetime_points >= 50 THEN 50
    ELSE 0
  END AS level_start,

  CASE
    WHEN ua.lifetime_points >= 20000 THEN 20000
    WHEN ua.lifetime_points >= 5000 THEN 20000
    WHEN ua.lifetime_points >= 1000 THEN 5000
    WHEN ua.lifetime_points >= 300 THEN 1000
    WHEN ua.lifetime_points >= 50 THEN 300
    ELSE 50
  END AS next_level_threshold,

  -- street_food_king removed — three badges remain
  jsonb_build_object(
    'the_scout', jsonb_build_object(
      'level', CASE WHEN ua.total_pioneers >= 250 THEN 5 WHEN ua.total_pioneers >= 100 THEN 4 WHEN ua.total_pioneers >= 50 THEN 3 WHEN ua.total_pioneers >= 15 THEN 2 WHEN ua.total_pioneers >= 5 THEN 1 ELSE 0 END,
      'count', ua.total_pioneers,
      'next_target', CASE WHEN ua.total_pioneers >= 250 THEN NULL WHEN ua.total_pioneers >= 100 THEN 250 WHEN ua.total_pioneers >= 50 THEN 100 WHEN ua.total_pioneers >= 15 THEN 50 WHEN ua.total_pioneers >= 5 THEN 15 ELSE 5 END
    ),
    'the_paparazzi', jsonb_build_object(
      'level', CASE WHEN ua.unique_photo_venues >= 500 THEN 5 WHEN ua.unique_photo_venues >= 250 THEN 4 WHEN ua.unique_photo_venues >= 100 THEN 3 WHEN ua.unique_photo_venues >= 25 THEN 2 WHEN ua.unique_photo_venues >= 5 THEN 1 ELSE 0 END,
      'count', ua.unique_photo_venues,
      'next_target', CASE WHEN ua.unique_photo_venues >= 500 THEN NULL WHEN ua.unique_photo_venues >= 250 THEN 500 WHEN ua.unique_photo_venues >= 100 THEN 250 WHEN ua.unique_photo_venues >= 25 THEN 100 WHEN ua.unique_photo_venues >= 5 THEN 25 ELSE 5 END
    ),
    'the_critic', jsonb_build_object(
      'level', CASE WHEN ua.total_notes_written >= 1000 THEN 5 WHEN ua.total_notes_written >= 500 THEN 4 WHEN ua.total_notes_written >= 200 THEN 3 WHEN ua.total_notes_written >= 50 THEN 2 WHEN ua.total_notes_written >= 10 THEN 1 ELSE 0 END,
      'count', ua.total_notes_written,
      'next_target', CASE WHEN ua.total_notes_written >= 1000 THEN NULL WHEN ua.total_notes_written >= 500 THEN 1000 WHEN ua.total_notes_written >= 200 THEN 500 WHEN ua.total_notes_written >= 50 THEN 200 WHEN ua.total_notes_written >= 10 THEN 50 ELSE 10 END
    )
  ) AS badges_unlocked

FROM user_aggregates ua
LEFT JOIN active_streaks st ON ua.user_id = st.user_id;

CREATE UNIQUE INDEX idx_user_gamification_stats_id ON public.user_gamification_stats(user_id);


-- ═══════════════════════════════════════════════════════════
-- 2. USER AREA LEADERBOARDS
-- ═══════════════════════════════════════════════════════════
CREATE MATERIALIZED VIEW public.user_area_leaderboards AS

WITH review_points AS (
  SELECT
    r.id AS review_id, r.user_id, r.restaurant_id, r.created_at,
    (
      10 +
      LEAST(COALESCE(array_length(r.dish_names, 1), 0) * 2, 6) +
      (CASE WHEN NULLIF(trim(r.notes), '') IS NOT NULL THEN 3 ELSE 0 END) +
      (CASE WHEN r.photo_url IS NOT NULL THEN 5 ELSE 0 END)
    ) AS standard_points
  FROM public.reviews r
),

area_grouping AS (
  SELECT
    rp.user_id, rest.area,
    SUM(rp.standard_points) AS raw_all_time_points,
    SUM(CASE WHEN rp.created_at >= date_trunc('month', now()) THEN rp.standard_points ELSE 0 END) AS raw_monthly_points,
    MIN(rp.created_at) AS first_review_in_area  -- the tiebreaker
  FROM review_points rp
  JOIN public.restaurants rest ON rp.restaurant_id = rest.id
  GROUP BY rp.user_id, rest.area
)

SELECT
  ag.user_id, ag.area,
  ROUND(ag.raw_all_time_points * COALESCE(ugs.active_streak_multiplier, 1.0))::int AS all_time_points,
  ROUND(ag.raw_monthly_points * COALESCE(ugs.active_streak_multiplier, 1.0))::int AS monthly_points,
  ROW_NUMBER() OVER (
    PARTITION BY ag.area
    ORDER BY (ag.raw_all_time_points * COALESCE(ugs.active_streak_multiplier, 1.0)) DESC,
             ag.first_review_in_area ASC
  ) AS all_time_rank,
  ROW_NUMBER() OVER (
    PARTITION BY ag.area
    ORDER BY (ag.raw_monthly_points * COALESCE(ugs.active_streak_multiplier, 1.0)) DESC,
             ag.first_review_in_area ASC
  ) AS monthly_rank
FROM area_grouping ag
LEFT JOIN public.user_gamification_stats ugs ON ag.user_id = ugs.user_id;

CREATE UNIQUE INDEX idx_user_area_leaderboards_lookup ON public.user_area_leaderboards(user_id, area);


-- ═══════════════════════════════════════════════════════════
-- 3. SCHEDULE THE HOURLY REFRESH
-- ═══════════════════════════════════════════════════════════
SELECT cron.schedule(
  'refresh-user-gamification',
  '5 * * * *',
  $$
    REFRESH MATERIALIZED VIEW CONCURRENTLY public.user_gamification_stats;
    REFRESH MATERIALIZED VIEW CONCURRENTLY public.user_area_leaderboards;
  $$
);

REFRESH MATERIALIZED VIEW public.user_gamification_stats;
REFRESH MATERIALIZED VIEW public.user_area_leaderboards;


DROP VIEW IF EXISTS public.foodie_leaderboard_global CASCADE;
DROP VIEW IF EXISTS public.foodie_leaderboard_by_area CASCADE;
DROP VIEW IF EXISTS public.restaurant_leaderboard CASCADE;


-- ═══════════════════════════════════════════════════════════
-- 1. FOODIE LEADERBOARD — GLOBAL
-- Ranks every user by lifetime_points. Rank is computed here (not in the
-- client) via window function, so the client just orders by rank and is done.
-- ═══════════════════════════════════════════════════════════
CREATE VIEW public.foodie_leaderboard_global AS
SELECT
  ugs.user_id,
  p.full_name,
  p.avatar_url,
  ugs.lifetime_points AS points,
  ugs.user_level,
  ugs.active_streak_weeks,
  RANK() OVER (ORDER BY ugs.lifetime_points DESC) AS rank
FROM public.user_gamification_stats ugs
JOIN public.profiles p ON p.id = ugs.user_id;

-- ═══════════════════════════════════════════════════════════
-- 2. FOODIE LEADERBOARD — BY AREA
-- Uses the pre-computed all_time_rank from user_area_leaderboards (already
-- partitioned by area), joined out to profile + level/streak info.
-- ═══════════════════════════════════════════════════════════
CREATE VIEW public.foodie_leaderboard_by_area AS
SELECT
  ual.user_id,
  ual.area,
  p.full_name,
  p.avatar_url,
  ual.all_time_points AS points,
  ual.all_time_rank AS rank,
  ugs.user_level,
  ugs.active_streak_weeks
FROM public.user_area_leaderboards ual
JOIN public.profiles p ON p.id = ual.user_id
LEFT JOIN public.user_gamification_stats ugs ON ugs.user_id = ual.user_id;

-- ═══════════════════════════════════════════════════════════
-- 3. RESTAURANT LEADERBOARD — GLOBAL + BY AREA
-- ═══════════════════════════════════════════════════════════
CREATE VIEW public.restaurant_leaderboard AS
SELECT
  rr.restaurant_id,
  rr.name,
  rr.area,
  rr.venue_type,
  r.primary_photo_url,
  rr.algorithm_score,
  rr.raw_review_count,
  RANK() OVER (ORDER BY rr.algorithm_score DESC) AS global_rank,
  RANK() OVER (PARTITION BY rr.area ORDER BY rr.algorithm_score DESC) AS area_rank
FROM public.restaurant_rankings rr
JOIN public.restaurants r ON r.id = rr.restaurant_id;

-- ═══════════════════════════════════════════════════════════
-- 4. INDEX SUPPORT
-- ═══════════════════════════════════════════════════════════
CREATE INDEX IF NOT EXISTS idx_ugs_lifetime_points
  ON public.user_gamification_stats (lifetime_points DESC);

CREATE INDEX IF NOT EXISTS idx_ual_area_rank
  ON public.user_area_leaderboards (area, all_time_rank);

CREATE INDEX IF NOT EXISTS idx_rr_area_score
  ON public.restaurant_rankings (area, algorithm_score DESC);

CREATE INDEX IF NOT EXISTS idx_rr_score
  ON public.restaurant_rankings (algorithm_score DESC);

-- ═══════════════════════════════════════════════════════════
-- 5. GRANTS
-- ═══════════════════════════════════════════════════════════
GRANT SELECT ON public.profiles TO anon, authenticated;
GRANT SELECT ON public.restaurants TO anon, authenticated;
GRANT SELECT ON public.user_gamification_stats TO anon, authenticated;
GRANT SELECT ON public.user_area_leaderboards TO anon, authenticated;
GRANT SELECT ON public.restaurant_rankings TO anon, authenticated;

GRANT SELECT ON public.foodie_leaderboard_global TO anon, authenticated;
GRANT SELECT ON public.foodie_leaderboard_by_area TO anon, authenticated;
GRANT SELECT ON public.restaurant_leaderboard TO anon, authenticated;


-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.profiles (
  id uuid NOT NULL,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  username text UNIQUE,
  bio text,
  is_public boolean DEFAULT true,
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.restaurants (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  area text NOT NULL,
  location USER-DEFINED NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  phone_number text,
  website text,
  price_level integer,
  opening_hours jsonb,
  primary_photo_url text,
  category text DEFAULT 'restaurant'::text,
  is_verified boolean DEFAULT true,
  venue_type text DEFAULT 'restaurant'::text,
  search_vector tsvector DEFAULT to_tsvector('english'::regconfig, ((((((COALESCE(name, ''::text) || ' '::text) || COALESCE(area, ''::text)) || ' '::text) || COALESCE(category, ''::text)) || ' '::text) || COALESCE(venue_type, ''::text))),
  lat double precision,
  lon double precision,
  business_status text,
  photo_urls ARRAY,
  full_address text,
  CONSTRAINT restaurants_pkey PRIMARY KEY (id)
);
CREATE TABLE public.reviews (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  dish_names ARRAY,
  food_score integer NOT NULL CHECK (food_score >= 1 AND food_score <= 10),
  ambiance_score integer NOT NULL CHECK (ambiance_score >= 1 AND ambiance_score <= 10),
  presentation_score integer NOT NULL CHECK (presentation_score >= 1 AND presentation_score <= 10),
  final_score numeric DEFAULT ((((food_score + ambiance_score) + presentation_score))::numeric / 3.0),
  notes text,
  photo_url text,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT reviews_pkey PRIMARY KEY (id),
  CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id),
  CONSTRAINT reviews_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES public.restaurants(id)
);
CREATE TABLE public.lists (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text,
  cover_image_url text,
  list_type text NOT NULL DEFAULT 'personal'::text CHECK (list_type = ANY (ARRAY['personal'::text, 'curated'::text])),
  owner_id uuid,
  is_public boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  source_type text DEFAULT 'manual'::text CHECK (source_type = ANY (ARRAY['manual'::text, 'leaderboard'::text, 'dish_tag'::text])),
  source_filter jsonb,
  home_tab text,
  home_rank integer,
  slug text UNIQUE,
  CONSTRAINT lists_pkey PRIMARY KEY (id),
  CONSTRAINT lists_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.list_restaurants (
  list_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  rank integer,
  added_by uuid,
  added_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT list_restaurants_pkey PRIMARY KEY (list_id, restaurant_id),
  CONSTRAINT list_restaurants_list_id_fkey FOREIGN KEY (list_id) REFERENCES public.lists(id),
  CONSTRAINT list_restaurants_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES public.restaurants(id),
  CONSTRAINT list_restaurants_added_by_fkey FOREIGN KEY (added_by) REFERENCES public.profiles(id)
);


| pg_get_functiondef                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
| CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (NEW.id, NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'avatar_url');

  insert into public.lists (title, subtitle, list_type, owner_id, source_type)
  values ('Want to Try', 'Restaurants you''re curious about', 'personal', NEW.id, 'manual');

  return NEW;
end;
$function$
                                                                                                                                                                                                                                                                                        |
| CREATE OR REPLACE FUNCTION public.add_restaurant_full(p_google_place_id text, p_name text, p_area text, p_lat double precision, p_lng double precision, p_phone_number text DEFAULT NULL::text, p_website text DEFAULT NULL::text, p_price_level integer DEFAULT NULL::integer, p_opening_hours text DEFAULT NULL::text, p_primary_photo_url text DEFAULT NULL::text, p_venue_type text DEFAULT 'restaurant'::text, p_google_rating numeric DEFAULT NULL::numeric, p_google_total_ratings integer DEFAULT NULL::integer)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  new_id uuid;
  existing_id uuid;
begin
  select id into existing_id from public.restaurants where google_place_id = p_google_place_id;
  if existing_id is not null then return existing_id; end if;

  insert into public.restaurants (
    google_place_id, name, area, location,
    phone_number, website, price_level, opening_hours,
    primary_photo_url, venue_type, google_rating,
    google_total_ratings, is_verified
  )
  values (
    p_google_place_id, p_name, p_area,
    extensions.geography(extensions.ST_MakePoint(p_lng, p_lat)),
    p_phone_number, p_website, p_price_level,
    p_opening_hours::jsonb,
    p_primary_photo_url, p_venue_type,
    p_google_rating, p_google_total_ratings, true
  )
  returning id into new_id;

  return new_id;
end;
$function$
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| CREATE OR REPLACE FUNCTION public.get_list_items(p_list_identifier text)
 RETURNS TABLE(restaurant_id uuid, name text, area text, primary_photo_url text, rank integer, score numeric, venue_type text, price_level integer, opening_hours jsonb)
 LANGUAGE plpgsql
AS $function$
DECLARE
  v_type text;
  v_filter jsonb;
BEGIN
  -- Look up the list using either the slug OR the UUID
  SELECT source_type, source_filter INTO v_type, v_filter
  FROM public.lists 
  WHERE slug = p_list_identifier 
     OR (p_list_identifier ~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$' 
         AND id = p_list_identifier::uuid);

  IF v_type = 'leaderboard' THEN
    RETURN QUERY
      SELECT rr.restaurant_id, rr.name, rr.area, r.primary_photo_url,
             row_number() OVER (ORDER BY rr.algorithm_score DESC)::int,
             rr.algorithm_score, rr.venue_type, r.price_level, r.opening_hours
      FROM public.restaurant_rankings rr
      JOIN public.restaurants r ON r.id = rr.restaurant_id
      WHERE rr.raw_review_count >= COALESCE((v_filter->>'min_reviews')::int, 0)
        AND (v_filter->>'category' IS NULL OR r.venue_type = v_filter->>'category')
      ORDER BY rr.algorithm_score DESC
      LIMIT COALESCE((v_filter->>'limit')::int, 50);

  ELSIF v_type = 'dish_tag' THEN
    RETURN QUERY
      SELECT r.id, r.name, r.area, r.primary_photo_url,
             row_number() OVER (ORDER BY avg(rev.final_score) DESC)::int,
             avg(rev.final_score), r.venue_type, r.price_level, r.opening_hours
      FROM public.reviews rev
      JOIN public.restaurants r ON r.id = rev.restaurant_id
      WHERE (v_filter->>'dish') = ANY(rev.dish_names)
      GROUP BY r.id, r.name, r.area, r.primary_photo_url, r.venue_type, r.price_level, r.opening_hours
      HAVING COUNT(*) >= COALESCE((v_filter->>'min_reviews')::int, 1)
      ORDER BY 5 DESC
      LIMIT COALESCE((v_filter->>'limit')::int, 20);

  ELSE
    RETURN QUERY
      SELECT lr.restaurant_id, r.name, r.area, r.primary_photo_url, lr.rank,
             (SELECT avg(rev.final_score) FROM public.reviews rev WHERE rev.restaurant_id = r.id),
             r.venue_type, r.price_level, r.opening_hours
      FROM public.list_restaurants lr
      JOIN public.restaurants r ON r.id = lr.restaurant_id
      WHERE lr.list_id = (
        SELECT id FROM public.lists 
        WHERE slug = p_list_identifier 
           OR (p_list_identifier ~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$' 
               AND id = p_list_identifier::uuid)
      )
      ORDER BY lr.rank NULLS LAST;
  END IF;
END;
$function$
 |