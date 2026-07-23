# The tinycss colour system

A guide to how colour works in tinycss — the theory, the tokens, and the specific
decisions behind the default palette. If you only remember one thing: **the whole
palette is generated from two hue angles, in OKLCH, and every shade is chosen so it
stays legible and in-gamut in both light and dark mode.**

---

## 1. Why OKLCH (and not HSL)

The palette used to be HSL. It's now **OKLCH** — `oklch(Lightness Chroma Hue)` — and
the difference matters for one reason: **OKLCH lightness is perceptual, HSL lightness
is not.**

In HSL, `hsl(H, 80%, 50%)` is a wildly different *apparent* brightness depending on the
hue: yellow at 50% looks almost white, blue at 50% looks nearly black. So a single
"lightness" number can't be trusted, and two accent colours picked at the same HSL
lightness will never feel balanced.

In OKLCH, `L` is calibrated to human perception. `oklch(62% C H)` looks like the *same
brightness* whatever the hue. That gives us three things HSL couldn't:

- **Balanced pairs by construction** — pin two accents to the same `L` and neither
  dominates.
- **Predictable ramps** — stepping `L` down produces evenly-spaced shades.
- **Reliable re-theming** — rotate the hue and the palette stays balanced (see §11).

The cost is a modern-browser baseline (OKLCH: Safari 15.4+, Chrome 111+, Firefox 113+).
That's fine for this project.

> **Honest caveat:** migrating an existing palette from HSL to OKLCH looks *nearly
> identical* — OKLCH is a better *substrate*, not a new look. The visible gains come
> from the per-mode *tuning* it makes easy (§5), and from being able to explore new
> palettes reliably.

---

## 2. The two-hue system

Everything derives from two custom properties — **hue angles** on the OKLCH wheel:

```css
--hue:     347;   /* primary   — magenta/pink */
--alt-hue: 227;   /* secondary — indigo       */
```

Change those two numbers and the entire palette shifts. (These are OKLCH angles, **not**
HSL degrees — magenta is 347 here, not 320.) A separate pair, `--surface-hue` /
`--surface-sat`, tints the background surfaces independently (see §10).

---

## 3. The shade ramps

Each accent is a 7-stop ramp from `lightest` to `darkest`. Only the **hue** comes from
the variable; each stop pins its own **lightness (L)** and **chroma (C)**, because the
amount of chroma a hue can hold changes with lightness (§6).

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

Note the two bases share **L = 62%** (perceptually matched) but carry different chroma:
magenta 0.250 vs indigo 0.105. That's not an oversight — it's the gamut talking (§6).

---

## 4. Light vs dark: the same identity, tuned per mode

The hue never changes between themes — the *tuning* does. The guiding rule:

> **Dark mode can be loud; light mode must be restrained.**

- **Dark mode** sits accents on near-black, which has huge luminance headroom. Saturated
  colour *glows* here, so we push chroma toward the gamut edge for that neon/synthwave
  feel. Links use the base primary; hover brightens.

  ```css
  --link-color:        var(--primary);                  /* oklch(62% .25 347) */
  --link-hover-color:  oklch(from var(--primary) 0.8 0.13 h);   /* brighter */
  --link-visited-color: oklch(from var(--primary) 0.6 0.13 h);  /* dimmer, desaturated */
  ```

- **Light mode** sits accents on near-white, where the *same* saturated colour has low
  contrast and reads as cheap "candy". So we drop **both lightness and chroma** — an
  inky, quiet accent that still clears WCAG AA:

  ```css
  --link-color:        oklch(from var(--primary) 0.52 0.16 h);  /* darker + less chroma */
  --link-hover-color:  oklch(from var(--primary) 0.44 0.15 h);
  --link-visited-color: oklch(from var(--primary) 0.46 0.10 h);
  --secondary:         oklch(0.5 0.09 var(--alt-hue));          /* tags/accents deepened */
  ```

The lesson worth internalising: **buy light-mode contrast with lightness, not
saturation.** Carrying dark-mode chroma onto white paper is the single most common
reason a light theme looks worse than its dark counterpart.

---

## 5. The sRGB gamut reality

sRGB can't display every OKLCH colour. Each hue has a **maximum chroma** that also
depends on lightness — and the ceilings are very uneven:

- **Magenta / red / violet** can be extremely saturated (chroma up past 0.25), and stay
  saturated even when bright.
- **Blue / indigo / cyan** hit their ceiling much lower (~0.10–0.20), and it *collapses*
  as they get lighter — a bright, vivid cyan simply doesn't exist in sRGB.

This is why the palette is shaped the way it is:

- **Magenta is the vivid hero** (base chroma 0.250). **Indigo stays deep and calm**
  (base chroma 0.105) — not because we wanted it muted, but because 0.25 at that hue
  would fall outside sRGB. They're matched in *lightness*, which is what makes them feel
  like equals despite the chroma gap.
- If you set a chroma a hue can't hold, the browser **gamut-maps** it (quietly clamps
  chroma) — nothing breaks, it just desaturates. The ramps are tuned to sit just inside
  the ceilings so this rarely triggers.

> The classic synthwave dream is hot-pink **+ electric cyan**. In sRGB that cyan can't
> glow next to the magenta — it always reads muted. (A wide-gamut / P3 build could.)

---

## 6. Choosing the secondary — colour harmony

With magenta (347°) fixed, where should the secondary sit? Colour theory gives named
relationships, measured as the hue distance from the primary:

| Relationship | Δ from primary | Character |
|---|---|---|
| Analogous | ~30–60° | Harmonious, calm — can be *too* similar to distinguish |
| Triadic | ~120° | Balanced, vibrant |
| Split-complement | ~150° | High contrast, a bit softer than a full complement |
| Complement | 180° | Maximum contrast/tension |

For magenta, the complement is green (~167°). The design tension is **harmony vs.
distinctness**: an analogous partner (violet ~312°) glows as "one family" but its accents
blur into the links; a complement (green ~140°) pops hard but veers "watermelon".

The choice landed on **indigo, 227°** — on the *cool arc* that contrasts with the warm
magenta without competing with it. It lets magenta stay the hero (magenta leads, indigo
supports), and unlike cyan it holds enough chroma to have body. It was picked from a
live side-by-side of the whole 167°→227° arc.

**Rules of thumb for picking a secondary:**
1. Decide the job first — *harmonise* (analogous) or *distinguish* (complement/split).
2. Check the gamut — a hue that can't hold chroma (blue/cyan) will read muted next to a
   saturated primary. Pair vivid with vivid, or accept the quieter partner on purpose.
3. Match lightness, not chroma, to keep the pair balanced.

---

## 7. Colour roles — what each colour *means*

Colour carries meaning here, it isn't just decoration. The rule:

> **Primary (magenta) = action. Secondary (indigo) = orientation & structure.**

| Magenta — you can act on it | Indigo — where you are / static furniture |
|---|---|
| Body links | Keyboard focus rings (`:focus-visible`) |
| Buttons, hover states | Inline `code` (so it never looks clickable) |
| Active nav item | Blockquote accent |
| | Link-post domain kicker (the source) |
| | Pagination page counter (`Page 3 of 10`) |
| | Tags, text selection |

Two payoffs: keyboard focus rings in indigo *pop* against the magenta links they
surround (instead of magenta-on-magenta), and inline code stops being mistaken for a
link. Nav items stay magenta because they *are* clickable.

A related typographic rule — **the "meta eyebrow"**: system-generated metadata (dates,
reading time, pagination) is set in tracked uppercase (`text-transform: uppercase;
letter-spacing: 0.08em`) as a quiet label voice. **Authored content stays as written** —
tags are lowercase (they're the writer's vocabulary, not chrome), and reset their own
letter-spacing so they don't inherit the eyebrow tracking.

---

## 8. Relative colours (and the minify trap)

Most per-mode variants are *derived* from `--primary` with relative-colour syntax rather
than declared as new variables:

```css
--link-hover-color: oklch(from var(--primary) 0.8 0.13 h);
/*                        ^origin           ^L  ^C   ^keep origin's hue */
```

`from var(--primary) … h` reads the origin colour and lets you override L/C while keeping
its hue — so these derivations automatically track any re-theme.

> **Minify trap:** relative-colour syntax depends on **significant spaces**. A naive
> whitespace-stripping minifier will corrupt `oklch(from … 0.8 0.13 h)`. Always use a
> **CSS-aware** minifier. (Hugo Pipes' minifier is; verified.)

---

## 9. Accessibility & tooling

Every accent is validated to clear **WCAG AA** (4.5:1 for normal text) against the
surfaces it appears on, and confirmed **in-gamut**, before shipping. The current light
and dark link/tag colours all land in the 5–9:1 range.

The migration used a small **Deno** script (no Node in this environment) implementing
OKLCH↔sRGB conversion, WCAG contrast, and a max-in-gamut-chroma solver — so each ramp
stop could be checked for both contrast and gamut. When adding or re-theming colours,
re-validate rather than eyeballing: OKLCH makes lightness predictable, but contrast
against a specific background still has to be measured.

---

## 10. Surface tint

Backgrounds are handled separately from accents, via a neutral-by-default knob:

```css
--surface-hue: 0;    --surface-sat: 0%;   /* dark mode: neutral */
```

Light mode warms them into "paper":

```css
--surface-hue: 40;   --surface-sat: 44%;  /* cream */
```

The trick: at 100% lightness the tint vanishes, so `--bg-chrome` stays pure white while
the reading surface is faintly cream. Near white, luminance steps are nearly invisible
but **hue** contrast survives — so a tinted "paper" reads as distinct from white chrome
where a slightly-grey panel would just look dated.

---

## 11. Re-theming

To shift the whole palette, change the two hue angles:

```css
:root { --hue: 55; --alt-hue: 195; }   /* e.g. amber + teal */
```

Because L/C are pinned per stop and only the hue rotates, the new palette stays balanced
and evenly-stepped automatically — this is the core OKLCH payoff.

**One caveat:** the per-stop **chroma** values are tuned for the default magenta/indigo.
A very different hue may hit a lower sRGB ceiling and get gamut-mapped (quietly
desaturated). For a hue far from the defaults, re-tune the chroma to that hue's ceiling
(and re-validate contrast) rather than assuming the numbers transfer.

In the Hugo theme, a blog can set `params.hue` / `params.altHue` to re-theme per site —
those are injected as an OKLCH `:root` override *after* the stylesheet so they win the
cascade.
