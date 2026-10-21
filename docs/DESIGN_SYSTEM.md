# Architectural showroom

Palette: ivory #F7F4EF; stone #E8E2D8; ink #20242A; muted #61605A; bronze #88683E for readable accents; champagne #CAA675 for decoration; consultation green #166849. Tokens and legacy aliases live in globals.css. Existing local Plus Jakarta Sans weights 400/600/800 are retained. Primary editorial headings use regular weight, negative tracking, and fluid sizes; body 14–16px with generous line height. Smaller captions are supplementary, never the only way to learn specifications.

Layout: max-width 1408px with 64px desktop / 32px tablet / 20–24px mobile gutters. Angular surfaces, minimal shadows, offset collection rows, local catalog imagery. Photography is labeled separately from simulated environments. No generated installation or workshop photography. Existing three-diamond logo motif retained in a warm adaptation, not represented as a new official vector asset.

Motion: motion/react, shared cubic-bezier(.22,1,.36,1), functional tap feedback, scroll-linked transforms and opacity. No global smooth scrolling: browser focus/validation must not move controls during a mobile tap. Explicit story navigation and camera presets animate independently. Reduced motion disables pinning and camera tweening.

## Storyboard

Sequence: hero → light story → collection → configurator/viewer → detail → antifog → workshop story → ordering → consultation → FAQ → footer.

Light story: space → shape → light → your choice. Four equal progress ranges [0,.25], [.25,.5], [.5,.75], [.75,1], with short crossfades, crop masks, subtle scale, and simulated ambient color during the third chapter. Extra scroll travel 240svh.

Workshop story: glass finishing → LED assembly → light inspection → installed result / inquiry. Same chapter boundaries; extra scroll travel 180svh. No invented production or customer claims.

Pinning requires width >=1024px AND height >=700px AND no reduced-motion preference. Sticky stage starts below measured header and ends at section bottom; native scroll remains in control. Stage height = 100svh minus header. Mobile, short screens, no JS, and reduced motion show the same chapter data as normal stacked articles. A visible skip link bypasses each story. Viewport/header changes and direct chapter hashes are handled without scroll listeners that update React every frame.
