# My Blog Stylesheet

A CSS foundation I put together for my personal blog and a couple of small websites. Nothing fancy—just a solid starting point that handles the basics: responsive typography, dark/light modes, and sensible defaults for long-form content.

## What's in here

- **A modern CSS reset** - Cobbled together from various best practices I've found
- **OKLCH-based color system** - Themeable from two hue values; perceptually uniform
- **Fluid typography** - Font size scales smoothly from 16px on mobile up to 21px on larger screens
- **Light & dark mode** - Follows your system preference, or set it manually
- **Prose styling** - Vertical rhythm and spacing for readable long-form content

## The colors

Built in **OKLCH** (perceptually uniform) and **themeable from two hue angles** — a
primary and a secondary. The default palette is **magenta + indigo**:

```css
--hue: 347;      /* Primary   - magenta (the hero: links, buttons, hover) */
--alt-hue: 227;  /* Secondary - indigo  (orientation: focus, code, tags)  */
```

Change those two numbers and the whole palette shifts — each accent gets a 7-stop
lighter→darker ramp automatically, and because OKLCH lightness is perceptual, a swapped
hue stays balanced by construction. Light and dark mode share the identity but tune
lightness/chroma per mode (restrained on paper, neon on black).

These are OKLCH hue *angles*, not HSL degrees. **For the full rationale — why OKLCH, why
these two colours, the per-mode tuning, gamut limits, colour roles, and how to re-theme —
see [`Colors.md`](Colors.md).**

## Typography

Three font stacks:

- **Open Sans** for headings and UI
- **Merriweather** for body text (nice for reading)
- **Fira Code** for code blocks

Headings use a Major Third scale (1.25 ratio), which gives good visual hierarchy without being too dramatic.

## Design tokens

Everything is a CSS custom property, so you re-theme by changing variables rather than rules:

- **Colours** — `--hue` / `--alt-hue` drive the `--primary*` and `--secondary*` shade ramps (7 each); per-theme `--bg*`, `--text*`, `--border`, `--link-*`, and `--heading` (pure black/white so titles pop).
- **Surface tint** — `--surface-hue` / `--surface-sat` (neutral by default) tint every background from one place. Because the tint vanishes at 100% lightness, you get "neutral-white chrome over faintly-tinted paper" for free.
- **Font sizes** — a t-shirt scale `--fs-4xs` … `--fs-4xl` for any non-heading size (headings use `--h1`…`--h6`; body uses `--p` / `--p2` / `--p3`).
- **Spacing** — `--space-3xs` … `--space-3xl`.
- **Radius** — `--radius-s/m/l`.
- **Line height** — `--lh-tight/snug/base`, for UI text outside `.prose`.
- **Shadows** — plain drops `--shadow-xs` (+ its upward mirror `--shadow-xs-up`) and `--shadow`, plus a card scale with inset highlights `--shadow-s/m/l`.

See `demo.html` for every one of these on a page.

## A couple of things worth knowing

- **Near white, luminance contrast disappears but hue contrast survives.** A faintly-tinted "paper" surface reads as distinct from white chrome, whereas a slightly-grey chrome just looks dated — the surface-tint tokens lean on this.
- **The same `rem` is not the same apparent size across fonts.** A sans face with a large x-height looks bigger than a serif at the same size, so UI text and reading text usually want different sizes, not just different families.
- **Relative colours** (`oklch(from var(--primary) 0.52 0.16 h)`) derive hover/visited/light-mode variants without extra variables — but they depend on significant spaces, so always minify with a **CSS-aware** tool.

## Prose styling

The `.prose` class handles vertical rhythm for blog posts and articles. There are also a few variants I use for different content types:

- **`.prose--compact`** - Tighter spacing, good for short updates
- **`.prose--photo`** - Extra space around images, centered captions
- **`.prose--link`** - For link posts with commentary

These are just foundations—modify them however you like for your own needs.

## Blog components

Beyond the design system, `style.css` also ships the site chrome a real blog needs:
layout container, site header/nav + theme toggle, footer, feed cards (`.entry`,
`.entry--post|note|link|photo` — including a Jim Nielsen-style link layout), the compact
`.stream` rows, `.photo-grid`, `.taglist`, `.pagination`, `.archive` and `.search`. These
are built on the same tokens, so the one-hue re-theming applies to them too — there's
nothing extra to include, it's all in the single `style.css`.

The class names are a flat, BEM-ish convention, so any static-site generator or
hand-written HTML can use them — a blog theme just needs to emit the matching markup.

## Quick start

```html
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <article class="prose">
    <!-- Your content -->
  </article>
</body>
</html>
```

Set `data-theme="light"` or `data-theme="dark"` on the html element, or remove it to follow system preference.

## Files

```
style.css                 - The complete framework: design system (tokens, reset,
                            typography, prose, badges) + blog components (header, feed
                            cards, stream, photo grid, gallery, tags, archive, search)
demo.html                 - Examples of everything
accessibility-report.js   - Run to check WCAG contrast compliance (node accessibility-report.js,
                            or deno run --unstable-detect-cjs -A accessibility-report.js)
accessibility-report.html - Generated report showing pass/fail for all colour combos
```

> **Minifying:** there's no pre-built `.min.css` — a project using this framework would
> minify at build time (for example, through its static-site generator's asset pipeline).
> If you minify standalone, use a **CSS-aware** minifier: the relative-colour syntax
> `hsl(from var(--primary) h s 38%)` relies on significant spaces, so naive
> whitespace-stripping will corrupt it.

## Resources that helped me

I learned a lot from these while putting this together:

- [Easy way to pick UI colors](https://www.youtube.com/watch?v=vvPklRN0Tco)
- [The 80% of UI design - Typography](https://www.youtube.com/watch?v=9-oefwZ6Z74)
- [The easy way to build a responsive website](https://www.youtube.com/watch?v=l04dDYW-QaI)

---

Feel free to use this however you like. It's just a hobby project!
