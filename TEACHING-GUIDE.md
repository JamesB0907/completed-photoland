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

Everything from Part 1 stays the same. We're only adding a `script.js` file,
a couple of small markup hooks, and a tiny bit of CSS for the new states.
Link the script right before `</body>` first, with `defer` so it runs after
the HTML has parsed:

```html
<script src="script.js" defer></script>
```

### 1. Like button

Swap the ❤ stat from a plain `<span>` into a `<button>` so it's clickable
and keyboard-focusable, and give the count its own `<span>` to update later:

```html
<button type="button" class="like-btn stat" aria-pressed="false">
    <span aria-hidden="true">❤</span> <span class="like-count">128</span> likes
</button>
```

In `script.js`:

```js
const likeButtons = document.querySelectorAll(".like-btn");

likeButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const liked = button.classList.toggle("liked");
        const countSpan = button.querySelector(".like-count");
        const currentCount = parseInt(countSpan.textContent, 10);

        countSpan.textContent = liked ? currentCount + 1 : currentCount - 1;
        button.setAttribute("aria-pressed", liked);
    });
});
```

Walk through each line: `querySelectorAll` grabs every like button at once,
`forEach` loops over them, `classList.toggle` flips the "liked" state and
hands back whether it's now on, and `textContent` reads/writes the visible
number. `aria-pressed` keeps assistive tech in sync with a toggle button —
mention this is the DOM equivalent of the `:checked` pseudo-class from Part 1.

### 2. Live search filter

The search input and photo cards already exist from Part 1 — no markup
changes needed, just read what's already on the page:

```js
const searchInput = document.getElementById("search-input");
const photoCards = document.querySelectorAll(".photo-card");

searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();

    photoCards.forEach((card) => {
        const cardText = card.textContent.toLowerCase();
        const isMatch = cardText.includes(searchTerm);

        card.style.display = isMatch ? "" : "none";
    });
});
```

Type "pets" or "travel" live and watch cards disappear/reappear. Point out
`card.textContent` pulls the title, tags, and photographer all at once — no
need to target each piece individually. Also add a `submit` handler on the
form to stop it reloading the page, since there's no backend:

```js
document.querySelector(".search-form").addEventListener("submit", (event) => {
    event.preventDefault();
});
```

### 3. Mobile nav toggle

Add a hamburger button in the header, before the `<nav>`, and give the nav
an `id` so the button can reference it:

```html
<button type="button" class="nav-toggle" aria-expanded="false" aria-controls="main-nav">
    <span aria-hidden="true">☰</span>
    <span class="visually-hidden">Menu</span>
</button>
<nav class="main-nav" id="main-nav" aria-label="Main navigation">
```

CSS: hide the button on wide screens, and inside the existing `@media
(max-width: 700px)` block, show it and collapse the nav by default:

```css
.nav-toggle { display: none; }

@media (max-width: 700px) {
    .nav-toggle { display: inline-flex; }
    .main-nav { display: none; width: 100%; }
    .main-nav.nav-open { display: block; }
    .main-nav ul { flex-direction: column; }
}
```

Then the JS:

```js
const navToggle = document.querySelector(".nav-toggle");
const mainNav = document.querySelector(".main-nav");

navToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", isOpen);
});
```

Shrink the browser window live to show the hamburger appear, then click it.

### 4. Wrap-up checklist

`querySelector`/`querySelectorAll` ✓, `addEventListener` ✓, `classList.toggle`
✓, `textContent` (read + write) ✓, `setAttribute` ✓, `preventDefault` ✓. Every
feature reuses the same handful of DOM methods — the point isn't to memorize
a long API, it's that a small toolkit goes a long way.
