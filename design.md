# Regal — Design Language Spec

A design reference reverse-engineered from the Regal landing page. The aesthetic is **confident, playful, and a little irreverent** — a bold SaaS brand wrapped in a hand-drawn "royalty" theme. Crisp grotesque type does the heavy lifting; scrappy marker doodles (crowns, arrows, sparkles) keep it from feeling corporate.

**One-line summary:** Periwinkle + neon-mint, heavy uppercase headlines, black pill buttons, and hand-drawn crowns everywhere.

---

## 1. Brand essence

| Trait | How it shows up |
|---|---|
| Royal / regal | Crown doodles are the core motif. Copy leans on the metaphor ("Treat your customers like royalty"). |
| Bold & loud | Oversized, often all-caps display type. High contrast. No timidity. |
| Playful / human | Hand-drawn marker scribbles — crowns, arrows, stars, underlines, circles — break up the polish. |
| Cheeky voice | "Don't be spam." / "even your college roommate will answer… or at least call you back." |
| Modern SaaS credibility | Clean product screenshots, logo cloud, testimonials, hard metrics. |

---

## 2. Color palette

The whole system runs on a **periwinkle / neon-mint / black / white** four-note chord. Use color in big confident blocks, not gradients.

| Token | Hex | Role |
|---|---|---|
| `--purple` | `#8384FE` | **Primary brand.** Full-bleed section backgrounds, the dominant surface. |
| `--mint` | `#ABFFAA` | **Accent.** Neon spring-green. Doodles, underlines, product-frame glows, highlights. Used sparingly for pop. |
| `--black` | `#000000` | Buttons, dark cards/sections, body text on light. |
| `--card-dark` | `#1A1A1A` | Near-black testimonial cards and footer container (sits on black/purple). |
| `--white` | `#FFFFFF` | Light section backgrounds, headline text on purple/dark, input fields. |
| `--lavender` | `#E9EAFF` | Soft alt background / page gutter. A pale tint of the primary. |
| `--ink` | `#1A1A1A` | Body copy on white. |
| `--muted` | `#6B6B72` | Secondary text, captions, role labels (e.g. "Education"). |

### Usage rules
- **Purple is the hero.** Most "marketing" sections are full purple; the product/feature deep-dives sit on white for legibility; testimonials and the footer go black.
- **Mint is a spice, not a base.** It appears only as accents — a crown, an underline scribble, a glow behind a product shot, the highlighted ROI number. Never a large fill.
- **Black does the work green doesn't** — all primary CTAs are black on purple for max contrast.
- Section rhythm alternates: **Purple → White → Purple → Black** to keep scroll energy high.

```css
:root {
  --purple:    #8384FE;
  --mint:      #ABFFAA;
  --black:     #000000;
  --card-dark: #1A1A1A;
  --white:     #FFFFFF;
  --lavender:  #E9EAFF;
  --ink:       #1A1A1A;
  --muted:     #6B6B72;
}
```

---

## 3. Typography

Two voices: a **heavy display grotesque** for impact and a **clean neutral sans** for everything readable.

### Display / headlines
- Heavy, tight, **often ALL CAPS** for the biggest moments ("TALK MORE, SELL MORE.", "TREAT YOUR CUSTOMERS LIKE ROYALTY").
- A condensed-leaning bold grotesque feel — think a heavy sans like *Druk / Founders Grotesk Bold / Aktiv Grotesk Black*. Tight letter-spacing, tight line-height (~0.95–1.0).
- Mid-tier headlines (white feature sections) drop to **sentence case but stay black-weight** ("Brand every interaction to drive engagement.").
- Sizes are big and unapologetic — hero headline dominates ~half the viewport width.

### Body / UI
- Clean, neutral sans (Inter / Helvetica Now / similar). Regular weight.
- Generous line-height (~1.5) for paragraphs.
- Labels & role tags: smaller, `--muted`, sometimes uppercase tracking.

### Signature text treatments
- **Inline brand-color word swap** — one word in a headline rendered in `--purple` over a struck-through alternative ("~~ABANDON~~ **ENGAGE** your customers").
- **Hand-drawn green underline** under a key word/phrase ("brand every **interaction**", "LIKE ROYALTY") — a marker scribble, not a clean rule.
- **Underlined links** in body copy (e.g. "event-driven calls").
- **Highlighted metrics** — big number with a mint underline ("**1,000,000** ROI-positive conversations").

```css
--font-display: "Druk", "Aktiv Grotesk", system-ui, sans-serif; /* heavy/black */
--font-body:    "Inter", "Helvetica Neue", Arial, sans-serif;
```

---

## 4. The doodle / motif system  ⭐ (the brand's signature)

This is what makes Regal *Regal*. A set of **hand-drawn, marker-style scribbles** scattered over otherwise clean layouts.

| Motif | Style | Where |
|---|---|---|
| **Crown** 👑 | Loose 3-point sketch, like drawn with a Sharpie. | The core motif. Sits on the logo, on people's heads in photos, tiled as a faint background pattern, on testimonial avatars. |
| **Arrows** | Curvy, hand-drawn, mid-stroke. | Point toward CTAs and key visuals ("Can your outbound contact center do this?"). Mint or black. |
| **Sparkle / star** | Four-point asterisk burst. | Mint accents near hero and CTA, drawing the eye. |
| **Underline scribble** | Rough single/double stroke. | Under emphasized words. Mint. |
| **Circle / oval lasso** | Loose ellipse drawn around an element. | Circles the email-capture field in the final CTA to say "do this." Mint. |

### Rules
- Doodles are **black on purple/light**, **mint as a vivid accent**, occasionally outline-only on dark.
- **Tiled crown pattern** is used as a low-contrast texture (tone-on-tone) behind hero imagery and across the black footer — adds richness without noise.
- Keep them sketchy and imperfect — vector-perfect versions kill the charm.
- Don't overdo per section: one or two gestures that *guide attention*, plus the ambient crown tile.

---

## 5. Logo

- Wordmark **"REGAL"** — heavy display caps.
- A small **crown sits on top** of the wordmark (green on dark surfaces, contextual elsewhere).
- White on purple/black; the crown is the consistent identifier.

---

## 6. Components

### Buttons
- **Primary (on purple):** solid **black**, white text, rounded (~8–10px) to pill. "Request demo".
- **Primary (on dark, footer):** solid **purple** (`--purple`), dark text, rounded. "Request".
- **Tertiary / utility ("Listen"):** transparent/dark fill with a thin light **border**, white text, small ▶ play glyph, rounded.
- All buttons: comfortable padding, no gradients, no heavy shadows.

### Inputs
- White pill/rounded field with light-gray placeholder ("Your email").
- Almost always **paired inline with a button** (email + Request demo) as a single capture unit.
- In the hero CTA the input is wrapped in a **hand-drawn mint lasso** for emphasis.

### Cards
- **Testimonial cards:** near-black (`--card-dark`), large radius (~16–20px), centered content. Circular avatar topped with a green crown, bold white name, muted role label, centered quote, bordered "Listen" button.
- **Feature blocks:** text column + product screenshot. The screenshot sits on a **mint frame/offset shadow** (a green rectangle peeking behind the UI) — gives the flat UI depth and ties in the accent.

### Logo cloud
- Single muted row of partner logos on purple, evenly spaced, low-emphasis — pure social proof.

### Footer
- Black background with faint tone-on-tone crown tile.
- A slightly lighter **dark rounded container** holds the link columns.
- Crowned REGAL mark, 2–3 link columns, an email-capture unit, legal row, social icons.

---

## 7. Layout & spacing

- **Full-bleed colored sections** stacked vertically, each a distinct "scene."
- Pale `--lavender` page margin/gutter framing the colored blocks (a subtle inset look).
- Generous vertical padding between sections; let headlines breathe.
- **Large corner radii** throughout (cards, inputs, image crops) — soft, friendly.
- Asymmetric hero: big headline + form on the left, layered imagery (photo + phone mockup) on the right.
- **Tilted photos:** in the final CTA, real photos are rotated a few degrees and given rounded corners + crown doodles — scrapbook energy.
- Horizontally **scrolling testimonial marquees** — two rows drifting in opposite directions.

---

## 8. Imagery

- Real, warm photography of people **on phone calls** (on-message for a calls/texts product).
- Each subject gets a **hand-drawn crown** on their head — instantly on-brand.
- Photos often masked into rounded rectangles, sometimes rotated.
- **Product UI** shown as clean, realistic screenshots (journey builder, branded caller ID phone screen) — the credible counterweight to the doodles.

---

## 9. Motion (implied)

- Scrolling testimonial rows (auto-marquee, opposing directions).
- Likely subtle hover lifts on buttons/cards.
- Doodles could be animated to draw-in on scroll (stroke reveal) — fits the marker concept.
- Keep it snappy and light; nothing slow or cinematic.

---

## 10. Voice & tone

Punchy, confident, conversational, slightly cheeky. Short declaratives. Talks to the reader directly and isn't afraid of a joke.

- "Talk more, sell more."
- "Don't be spam."
- "Give your agents superpowers."
- "See what's working — and what's not."
- "…even your college roommate will answer… or at least call you back."

**Do:** lead with benefit, be bold, use the royalty metaphor, drop a wink.
**Don't:** sound like enterprise boilerplate, hedge, over-explain.

---

## 11. Quick "do / don't" for recreating the look

**Do**
- Anchor on periwinkle `#8384FE`; spice with neon-mint `#ABFFAA`.
- Go big and bold with heavy grotesque headlines, lots of caps.
- Sprinkle hand-drawn crowns/arrows/sparkles to guide the eye.
- Black pill CTAs, rounded white inputs, generous radii.
- Alternate purple / white / black section backgrounds.

**Don't**
- Use gradients, drop-shadowed glassy cards, or pastel mush.
- Make the doodles clean vectors — keep them marker-rough.
- Let mint become a background fill — it's an accent only.
- Tone down the headlines — the loudness *is* the brand.