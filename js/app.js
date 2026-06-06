import {
    renderShowList,
    renderReviewCount,
    renderStars,
    renderReviewCard
} from "./ui.js";
import { shows } from "./data.js";

/* ----------------------
DOM ELEMENTS
---------------------- */

const viewHome = document.getElementById("home-view");
const viewDetail = document.getElementById("view-detail");
const showList = document.getElementById("shows-list");

/* ----------------------
SHOW / HIDE VIEWS
---------------------- */

const showView = (view) => {
    viewHome.classList.add("hidden");
    viewDetail.classList.add("hidden");

    view.classList.remove("hidden");

    document.getElementById("detail-error")?.classList.add("hidden");
};

/* ----------------------
HOME NAVIGATION
---------------------- */

document.getElementById("home-link").addEventListener("click", (e) => {
    e.preventDefault();
    showView(viewHome);
});

document.getElementById("nav-logo").addEventListener("click", (e) => {
    e.preventDefault();
    showView(viewHome);
});

document.getElementById("shows-link").addEventListener("click", (e) => {
    e.preventDefault();
    showView(viewHome);
    document.getElementById("shows-list").scrollIntoView({ behavior: "smooth" });
});

document.getElementById("explore-btn").addEventListener("click", () => {
    document.getElementById("shows-list").scrollIntoView({ behavior: "smooth" });
});

/* ----------------------
HAMBURGER MENU (MOBILE)
---------------------- */

document.getElementById("hamburger").addEventListener("click", () => {
    document.querySelector(".nav-links").classList.toggle("open");
});

/* ----------------------
HERO BACKGROUND COLLAGE
---------------------- */

const renderHeroBg = (data) => {
    const bg = document.querySelector(".hero-bg");
    if (!bg) return;

    const picks = data.filter(s => s.imageUrl).slice(-6);
    bg.innerHTML = picks.map(s => `<img src="${s.imageUrl}" alt="${s.title}">`).join("");
};

/* ----------------------
TABS
---------------------- */

const activateTab = (tabName) => {
    document.querySelectorAll(".tab").forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.tab === tabName);
    });
    document.querySelectorAll(".tab-content").forEach((content) => {
        content.classList.add("hidden");
    });
    document.getElementById(`tab-${tabName}`).classList.remove("hidden");
};

document.querySelectorAll(".tab").forEach((btn) => {
    btn.addEventListener("click", () => activateTab(btn.dataset.tab));
});

document.getElementById("back-btn").addEventListener("click", () => {
    showView(viewHome);
});

/* ----------------------
LOAD SHOW DETAIL
---------------------- */

const loadShowDetail = (id) => {
    const show = shows.find(s => s.id === id);
    if (!show) return;

    showView(viewDetail);

    const avgRating = show.reviews?.length > 0
        ? show.reviews.reduce((sum, r) => sum + r.rating, 0) / show.reviews.length
        : 0;

    document.getElementById("detail-poster").src = show.imageUrl;
    document.getElementById("detail-poster").alt = show.title;
    document.getElementById("breadcrumb-title").textContent = show.title;
    document.getElementById("detail-title").textContent = show.title;
    document.getElementById("detail-genre").textContent = show.genre;
    document.getElementById("detail-year").textContent = show.year;
    document.getElementById("detail-stars").textContent = renderStars(avgRating);
    document.getElementById("detail-review-count").textContent =
        `(${renderReviewCount(show.reviews?.length ?? 0)})`;
    document.getElementById("detail-description").textContent = show.description;

    document.getElementById("review-list").innerHTML =
        show.reviews?.length > 0
            ? show.reviews.map(renderReviewCard).join("")
            : "<p class='no-content'>No reviews yet.</p>";

    activateTab("reviews");
};

/* ----------------------
LOAD SHOWS
---------------------- */

const loadShows = () => {
    showList.innerHTML = renderShowList(shows);
    renderHeroBg(shows);

    document.querySelectorAll(".show-card").forEach((card) => {
        card.addEventListener("click", () => loadShowDetail(card.dataset.id));
    });
};

loadShows();
