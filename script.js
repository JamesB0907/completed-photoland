// ---------- Feature 1: Like buttons ----------
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

// ---------- Feature 2: Live search filter ----------
const searchForm = document.querySelector(".search-form");
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

// There's no backend to submit to, so just stop the page from reloading
searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
});

// ---------- Feature 3: Mobile nav toggle ----------
const navToggle = document.querySelector(".nav-toggle");
const mainNav = document.querySelector(".main-nav");

navToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", isOpen);
});
