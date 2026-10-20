# Photoland — Class Walkthrough

A step-by-step build order for live coding. Each step says *what* to type and
*why*, grouped by concept instead of top-to-bottom file order, so you can
pause on a concept before moving to the next.

Reference files: `index.html`, `style.css`.

---

## Part 1 — Semantic & Accessible HTML, Advanced CSS

### A. Structure first (HTML)

1. **Boilerplate.** `<!DOCTYPE html>`, `<html lang="en">`, charset + viewport
   meta, `<title>`, link to `style.css`. Nothing new here — just set the stage.

2. **Landmarks.** Add empty `<header>`, `<nav>`, `<main>`, `<footer>` shells.
   Talk about why screen readers announce these as "landmarks" you can jump
   between, instead of generic `<div>`s.

3. **Skip link.** One `<a class="skip-link" href="#main-content">Skip to
   main content</a>` right after `<body>`. Explain: keyboard users shouldn't
   have to tab through the whole nav every page load. It'll be invisible
   until focused — CSS comes later.

4. **Header contents.**
   - Logo as a `<p class="logo">` with a decorative emoji wrapped in
     `<span aria-hidden="true">` (so a screen reader doesn't announce "camera
     emoji").
   - `<nav aria-label="Main navigation">` with a `<ul>` of links. One link
     gets `aria-current="page"` — explain this tells assistive tech (and
     later, CSS) which page is active, like `:visited` but for navigation state.
   - `<form class="search-form" role="search">` with a `<label for=
     "search-input" class="visually-hidden">` paired to the input — explain
     every input needs a label, even if you hide it visually.

5. **Hero.** `<section class="hero">` with an `<h1>` and a tagline `<p>`.

6. **One photo card.** Build a single card fully before copy-pasting:
   ```html
   <figure class="photo-card">
     <img src="images/mountain-sunset.svg" alt="Sunset glowing orange behind a mountain range">
     <figcaption>
       <h3>Mountain Sunset</h3>
       <p class="photographer">by <a href="#">AlexRivera</a></p>
       <ul class="tags"><li><a href="#">nature</a></li></ul>
       <p class="stats"><span class="stat"><span aria-hidden="true">❤</span> 128 likes</span></p>
     </figcaption>
   </figure>
   ```
   Teach: `<figure>`/`<figcaption>` is the semantic pair for "image + its
   caption." Alt text should describe the *content*, never start with
   "image of" or "photo of" — that's redundant with the `<img>` tag itself.

7. **Duplicate the card** 7 more times inside a wrapping `<div
   class="photo-grid">`, swapping image/title/tags/stats. Good moment to
   point out alt text should stay unique and descriptive per image, not copy-pasted.

8. **Sidebar.** `<aside aria-labelledby="trending-heading">` with its own
   `<h2 id="trending-heading">` and a tag list. Explain `aria-labelledby`:
   instead of a hidden label, point to a heading that's already on screen.

9. **Footer.** `<footer>` with a `<time datetime="2026">2026</time>` —
   machine-readable dates, not just a styling hook.

### B. Style it (CSS)

10. **Variables.** `:root { --color-primary: ...; --spacing-md: ...; }`.
    Explain: one place to change the whole theme, reused everywhere with `var()`.

11. **Reset + base.** `box-sizing: border-box` on `*`, body font/background
    from variables.

12. **Header = Flexbox.** `.site-header { display: flex; justify-content:
    space-between; flex-wrap: wrap; gap: ...; }`. This is the "aha" moment
    for flexbox — items spread out and wrap on narrow screens for free.

13. **Nav + separators.** Flex the `<ul>`, then show
    `.main-nav li:not(:last-child) { border-right: ...; }` — a pseudo-class
    that says "every item except the last one."

14. **Accessibility CSS.** `.visually-hidden` (off-screen positioning),
    `.skip-link` (off-screen until `:focus` moves it on-screen), and a
    universal `:focus-visible` outline rule. Tab through the page here to
    show the skip link appearing.

15. **Hero pseudo-element.** `.hero p::after { content: ""; ... }` — a
    decorative underline bar with *no extra HTML*. Point out `::before`/
    `::after` generate content that isn't in the DOM.

16. **Page layout = Grid.** `.page-layout { display: grid; grid-template-
    columns: 3fr 1fr; gap: ...; }` to place the gallery next to the sidebar.
    Add the matching `@media (max-width: 700px)` rule that collapses it to
    one column — grid makes this a one-line change.

17. **Photo grid = Grid again.** `.photo-grid { display: grid; grid-
    template-columns: repeat(auto-fill, minmax(220px, 1fr)); }`. Resize the
    browser live — cards reflow automatically, no media query needed.

18. **Card hover.** `.photo-card:hover { transform: translateY(-4px); }` —
    simple pseudo-class interactivity, no JS required.

19. **Title icon.** `.photo-card h3::before { content: "📸 "; }` — another
    pseudo-element, reinforcing step 15's concept.

20. **Tags/stats = Flexbox.** Flex both lists so they wrap tidily, then the
    fun trick: `.tags a::before { content: "#"; }` — the `#` is *never* in
    the HTML, CSS adds it. Ask the class to find it in the markup (they won't).

21. **Alternating tags.** `.tag-cloud li:nth-child(even) a { ... }` — one
    more pseudo-class, structural selection without classes on every `<li>`.

22. **Wrap-up checklist.** Confirm on screen: semantic landmarks ✓,
    accessible labels/alt text/focus states ✓, CSS variables ✓, Flexbox ✓,
    Grid ✓, pseudo-classes (`:hover`, `:not`, `:nth-child`, `:focus-visible`)
    ✓, pseudo-elements (`::before`, `::after`) ✓.

---

## Part 2 — Adding JavaScript (DOM methods)

*Added on the `with-javascript` branch — same HTML/CSS as Part 1, plus a
small `script.js` and a few markup hooks. This section is appended once that
branch is built.*
