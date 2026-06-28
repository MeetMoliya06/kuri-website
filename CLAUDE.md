# Kuri Website — Claude Code Notes

## Critical: Do NOT touch these CSS rules

### Mobile scroll fix — `#smooth-wrapper` and `.hero` overflow

`#smooth-wrapper` uses `overflow-x: clip` (not `hidden`).
`.hero` uses `overflow: clip` (not `hidden`).

**Do not change these to `overflow: hidden`.** On iOS Safari, `overflow: hidden` creates an implicit scroll container that swallows touch events, breaking vertical page scrolling on mobile — specifically, users cannot scroll past the phone mockup image. `overflow: clip` does identical visual clipping without creating a scroll container.

This was a hard-won fix. Do not revert it.
