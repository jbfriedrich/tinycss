# My Blog Stylesheet

A CSS foundation I put together for my personal blog and a couple of small websites. Nothing fancy—just a solid starting point that handles the basics: responsive typography, dark/light modes, and sensible defaults for long-form content.

## What's in here

- **A modern CSS reset** - Cobbled together from various best practices I've found
- **HSL-based color system** - Easy to customize by changing a couple of hue values
- **Fluid typography** - Font size scales smoothly from 16px on mobile up to 21px on larger screens
- **Light & dark mode** - Follows your system preference, or set it manually
- **Prose styling** - Vertical rhythm and spacing for readable long-form content

## The colors

I'm using an HSL-based system where you just set a primary hue (currently 320, a nice pink/magenta) and a secondary hue (220, a blue). From there, each color gets lighter and darker variants automatically.

```css
--hue: 320;      /* Primary - pink/magenta */
--alt-hue: 220;  /* Secondary - blue */
```

Change those two numbers and the whole palette shifts. Each color has variants from lightest to darkest.

## Typography

Three font stacks:

- **Inter** for headings and UI
- **Merriweather** for body text (nice for reading)
- **Fira Code** for code blocks

Headings use a Major Third scale (1.25 ratio), which gives good visual hierarchy without being too dramatic.

## Prose styling

The `.prose` class handles vertical rhythm for blog posts and articles. There are also a few variants I use for different content types:

- **`.prose--compact`** - Tighter spacing, good for short updates
- **`.prose--photo`** - Extra space around images, centered captions
- **`.prose--link`** - For link posts with commentary

These are just foundations—modify them however you like for your own needs.

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
style.css                 - The stylesheet
demo.html                 - Examples of everything
accessibility-report.js   - Run with Node to check WCAG contrast compliance
accessibility-report.html - Generated report showing pass/fail for all color combos
```

## Resources that helped me

I learned a lot from these while putting this together:

- [Easy way to pick UI colors](https://www.youtube.com/watch?v=vvPklRN0Tco)
- [The 80% of UI design - Typography](https://www.youtube.com/watch?v=9-oefwZ6Z74)
- [The easy way to build a responsive website](https://www.youtube.com/watch?v=l04dDYW-QaI)

---

Feel free to use this however you like. It's just a hobby project!
