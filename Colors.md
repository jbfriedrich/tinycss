# The tinycss colour system

How colour works in tinycss — first the **palette and how to use it**, then the
**theory and decisions** behind it. The one-line version: the whole palette is generated
from two hue angles in **OKLCH**, and every shade is tuned to stay legible (WCAG AA) and
in-gamut in both light and dark mode.

---

# Part 1 — The palette & how to use it

## The palette at a glance

Two accents, chosen deliberately (see §*Choosing the secondary* for why):

- **Primary — magenta**, OKLCH hue **347°**. The hero: links, buttons, hover, anything
  you act on. Kept vivid.
- **Secondary — indigo**, OKLCH hue **227°**. The supporting voice: it contrasts with
  magenta (cool vs warm) without competing, so magenta stays the star.

```css
--hue:     347;   /* primary   — magenta */
--alt-hue: 227;   /* secondary — indigo  */
```

These are **OKLCH hue angles, not HSL degrees** (magenta is 347 here, not 320). Change
the two numbers and the whole palette shifts — see *Re-theming*.

## The shade ramps

Each accent is a 7-stop ramp. Only the **hue** comes from the variable; each stop pins
its own **lightness (L)** and **chroma (C)**, because how much chroma a hue can hold
changes with lightness (see §*The sRGB gamut reality*).

**Primary — magenta, hue 347**

| Token | L | C |
|---|---|---|
| `--primary-lightest` | 96% | 0.022 |
| `--primary-light` | 90% | 0.060 |
| `--primary-lighter` | 78% | 0.160 |
| `--primary` (base) | 62% | 0.250 |
| `--primary-darker` | 45% | 0.185 |
| `--primary-dark` | 25% | 0.095 |
| `--primary-darkest` | 15% | 0.055 |

**Secondary — indigo, hue 227**

| Token | L | C |
|---|---|---|
| `--secondary-lightest` | 96% | 0.020 |
| `--secondary-light` | 90% | 0.050 |
| `--secondary-lighter` | 78% | 0.120 |
| `--secondary` (base) | 62% | 0.105 |
| `--secondary-darker` | 45% | 0.078 |
| `--secondary-dark` | 25% | 0.049 |
| `--secondary-darkest` | 15% | 0.044 |

The two bases share **L = 62%** (perceptually matched, so neither dominates) but carry
different chroma — magenta 0.250 vs indigo 0.105. That gap is the gamut talking, not an
oversight (§*The sRGB gamut reality*).

## Per-mode accent values

The hue never changes between themes; the *tuning* does. These are the actual link/tag
values, all WCAG-AA verified against the surface they sit on:

| Role | Dark mode | Light mode |
|---|---|---|
| Link | `oklch(from --primary 0.65 0.24 h)` | `oklch(from --primary 0.52 0.16 h)` |
| Link hover | `oklch(from --primary 0.80 0.13 h)` | `oklch(from --primary 0.44 0.15 h)` |
| Link visited | `oklch(from --primary 0.63 0.13 h)` | `oklch(from --primary 0.46 0.10 h)` |
| Secondary / tags | `--secondary` (62% 0.105) | `oklch(0.5 0.09 --alt-hue)` |

Dark links are lifted to **L65** (not the base L62) because the main content surface,
`.site-main`, is `--bg-light` (10% grey), where the base would only reach ~4.2:1 — L65
clears AA at 4.77:1. Light links drop to **L52 and lower chroma** so they read inky, not
candy, on paper.

## Colour roles — what each colour *means*

> **Primary (magenta) = action. Secondary (indigo) = orientation & structure.**

| Magenta — you can act on it | Indigo — where you are / static furniture |
|---|---|
| Body links | Keyboard focus rings (`:focus-visible`) |
| Buttons, hover states | Inline `code` (so it never looks clickable) |
| Active nav item | Blockquote accent |
| | Link-post domain kicker (the source) |
| | Pagination page counter (`Page 3 of 10`) |
| | Tags, text selection |

Payoffs: focus rings in indigo *pop* against the magenta links they surround (instead of
magenta-on-magenta), and inline code stops reading as a link. Nav items stay magenta —
they *are* clickable.

Related typographic rule, the **"meta eyebrow"**: system-generated metadata (dates,
reading time, pagination) is set tracked-uppercase (`text-transform: uppercase;
letter-spacing: 0.08em`) as a quiet label voice. **Authored content stays as written** —
tags are lowercase (the writer's vocabulary, not chrome) and reset their own
letter-spacing so they don't inherit the eyebrow tracking.

## Re-theming

Change the two hue angles to shift the whole palette:

```css
:root { --hue: 55; --alt-hue: 195; }   /* e.g. amber + teal */
```

Because L/C are pinned per stop and only the hue rotates, the new palette stays balanced
and evenly-stepped automatically — the core OKLCH payoff.

**Caveat:** the per-stop **chroma** values are tuned for the default magenta/indigo. A
very different hue may hit a lower sRGB ceiling and get gamut-mapped (quietly
desaturated). For a hue far from the defaults, re-tune chroma to that hue's ceiling — and
**re-validate contrast** — rather than assuming the numbers transfer.

In the Hugo theme, a blog can set `params.hue` / `params.altHue` to re-theme per site;
they're injected as an OKLCH `:root` override *after* the stylesheet so they win the
cascade.

## Accessibility

Every accent clears **WCAG AA** (≥4.5:1 for normal text) against the surfaces it appears
on, in both modes, and is confirmed in-gamut. Current lows are ~4.7:1 (dark link/visited
on the `--bg-light` content surface); most combinations sit 5–9:1.

Re-validate when you add or re-theme colours — OKLCH makes *lightness* predictable, but
contrast against a specific background still has to be measured, and the elevated
`--bg-light` surface is the tightest constraint in dark mode.

---

# Part 2 — The theory & decisions

## Why OKLCH (and not HSL)

`oklch(Lightness Chroma Hue)`. The difference from HSL that matters: **OKLCH lightness is
perceptual, HSL lightness is not.**

In HSL, `hsl(H, 80%, 50%)` is a wildly different *apparent* brightness by hue — yellow at
50% looks almost white, blue at 50% nearly black. So the "lightness" number can't be
trusted, and two accents at the same HSL lightness never feel balanced. OKLCH calibrates
`L` to human perception: `oklch(62% C H)` looks the same brightness at any hue. That buys:

- **Balanced pairs by construction** — same `L` → neither dominates.
- **Predictable ramps** — stepping `L` gives evenly-spaced shades.
- **Reliable re-theming** — rotate the hue, the palette stays balanced.

Cost: a modern-browser baseline (Safari 15.4+, Chrome 111+, Firefox 113+). Fine here.

> **Honest caveat:** migrating an existing palette HSL→OKLCH looks *nearly identical* —
> OKLCH is a better *substrate*, not a new look. The visible gains come from the per-mode
> *tuning* it makes easy, and from being able to explore new palettes reliably.

## Light vs dark: the same identity, tuned per mode

> **Dark mode can be loud; light mode must be restrained.**

- **Dark** sits accents on near-black, which has huge luminance headroom — saturated
  colour *glows*, so we push chroma toward the gamut edge for a neon/synthwave feel.
- **Light** sits accents on near-white, where the *same* saturated colour reads as cheap
  "candy". So we drop **both lightness and chroma** for an inky, quiet accent that still
  clears AA.

The lesson: **buy light-mode contrast with lightness, not saturation.** Carrying
dark-mode chroma onto white paper is the single most common reason a light theme looks
worse than its dark counterpart.

## The sRGB gamut reality

sRGB can't display every OKLCH colour; each hue has a **maximum chroma** that also depends
on lightness, and the ceilings are very uneven:

- **Magenta / red / violet** stay saturated even when bright (chroma past 0.25).
- **Blue / indigo / cyan** cap much lower (~0.10–0.20), and the ceiling *collapses* as
  they lighten — a bright, vivid cyan doesn't exist in sRGB.

Hence the palette's shape: **magenta is the vivid hero; indigo stays deep and calm** — not
by preference but because 0.25 at that hue falls outside sRGB. They're matched in
*lightness*, which is what makes them read as equals despite the chroma gap. Set a chroma
a hue can't hold and the browser **gamut-maps** it (quietly clamps) — nothing breaks, it
just desaturates.

> The classic synthwave dream is hot-pink **+ electric cyan**. In sRGB that cyan can't
> glow next to the magenta — it always reads muted. (A wide-gamut / P3 build could.)

## Choosing the secondary — colour harmony

With magenta (347°) fixed, colour theory gives named relationships by hue distance:

| Relationship | Δ from primary | Character |
|---|---|---|
| Analogous | ~30–60° | Harmonious, calm — can be *too* similar to distinguish |
| Triadic | ~120° | Balanced, vibrant |
| Split-complement | ~150° | High contrast, softer than a full complement |
| Complement | 180° | Maximum contrast/tension |

The tension is **harmony vs. distinctness**: analogous violet (~312°) glows as "one
family" but its accents blur into the links; the green complement (~140–167°) pops hard
but veers "watermelon". We landed on **indigo, 227°** — on the *cool arc* that contrasts
with warm magenta without competing, lets magenta lead, and (unlike cyan) holds enough
chroma to have body. It was chosen from a live side-by-side of the whole 167°→227° arc.

**Rules of thumb for a secondary:** (1) decide the job — *harmonise* (analogous) or
*distinguish* (complement/split); (2) check the gamut — a hue that can't hold chroma
reads muted next to a saturated primary; (3) match lightness, not chroma, to stay
balanced.

## Relative colours (and the minify trap)

Per-mode variants are *derived* from `--primary` rather than declared anew:

```css
--link-hover-color: oklch(from var(--primary) 0.8 0.13 h);
/*                        ^origin           ^L  ^C   ^keep origin's hue */
```

`from var(--primary) … h` reads the origin and overrides L/C while keeping its hue — so
these track any re-theme automatically.

> **Minify trap:** relative-colour syntax depends on **significant spaces**; a naive
> whitespace-stripping minifier corrupts `oklch(from … 0.8 0.13 h)`. Always use a
> **CSS-aware** minifier (Hugo Pipes' is; verified).

## Surface tint

Backgrounds are handled separately from accents, via `--surface-hue` / `--surface-sat`
(neutral by default; light mode warms them to `40 / 44%` for "paper"). The trick: at 100%
lightness the tint vanishes, so `--bg-chrome` stays pure white while the reading surface
is faintly cream. Near white, luminance steps are nearly invisible but **hue** contrast
survives — so tinted paper reads as distinct from white chrome where a grey panel would
just look dated.

## Tooling

The migration used a small **Deno** script (no Node here) implementing OKLCH↔sRGB
conversion, WCAG contrast, and a max-in-gamut-chroma solver, so each ramp stop and accent
could be checked for both contrast and gamut. Prefer measuring over eyeballing.
