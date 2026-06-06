
import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import {
    getAuth,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import {
    firebaseConfig
} from "./firebase-config.js";
import {
    renderHeader,
    renderShowList,
    renderError,
    renderReviewCount,
    renderStars,
    renderReviewCard
} from "./ui.js";
import { shows } from "./data.js";

/* ----------------------
FIREBASE SETUP
---------------------- */

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

/* ----------------------
DOM ELEMENTS
---------------------- */

const viewHome = document.getElementById("home-view");
const viewDetail = document.getElementById("view-detail");
const viewProfile = document.getElementById("profile-view");
const navUser = document.getElementById("nav-user");
const loginError = document.getElementById("login-error");
const showList = document.getElementById("shows-list");
const loginModal = document.getElementById("login-modal");
const loginBtnNav = document.getElementById("login-btn-nav");
const loginBtnNavMobile = document.getElementById("login-btn-mobile");

/* ----------------------
SHOW / HIDE VIEWS
---------------------- */

const showView = (view) => {
    viewHome.classList.add("hidden");
    viewDetail.classList.add("hidden");
    viewProfile.classList.add("hidden");

    view.classList.remove("hidden");

    ["detail-error", "profile-error"].forEach(id => {
        document.getElementById(id)?.classList.add("hidden");
    });
};

/* ----------------------
LOGIN MODAL
---------------------- */

const openLoginModal = () => loginModal.classList.remove("hidden");
const closeLoginModal = () => loginModal.classList.add("hidden");

loginBtnNav.addEventListener("click", openLoginModal);
loginBtnNavMobile.addEventListener("click", openLoginModal);

document.getElementById("close-login-modal").addEventListener("click", closeLoginModal);

loginModal.addEventListener("click", (e) => {
    if (e.target === loginModal) closeLoginModal();
});

/* ----------------------
AUTH STATE
---------------------- */

onAuthStateChanged(auth, (user) => {
    navUser.textContent = renderHeader(user);

    if (user) {
        loginBtnNav.classList.add("hidden");
        loginBtnNavMobile.classList.add("hidden");
        document.getElementById("logout-btn").classList.remove("hidden");
        document.getElementById("mobile-logout").classList.remove("hidden");
        document.getElementById("mobile-login").classList.add("hidden");
        closeLoginModal();
    } else {
        loginBtnNav.classList.remove("hidden");
        loginBtnNavMobile.classList.remove("hidden");
        document.getElementById("logout-btn").classList.add("hidden");
        document.getElementById("mobile-logout").classList.add("hidden");
        document.getElementById("mobile-login").classList.remove("hidden");
    }
});

/* ----------------------
LOGIN
---------------------- */

document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const btn = document.getElementById("login-btn");

    btn.disabled = true;
    btn.textContent = "Logging in...";

    try {
        await signInWithEmailAndPassword(auth, email, password);
        loginError.classList.add("hidden");
    } catch (err) {
        loginError.textContent = renderError(err.message);
        loginError.classList.remove("hidden");
    } finally {
        btn.disabled = false;
        btn.textContent = "Log in";
    }
});

/* ----------------------
LOGOUT
---------------------- */

const handleLogout = async () => {
    await signOut(auth);
};

document.getElementById("logout-btn").addEventListener("click", handleLogout);
document.getElementById("logout-btn-mobile").addEventListener("click", handleLogout);

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

/* ----------------------
PROFILE
---------------------- */

document.getElementById("profile-link").addEventListener("click", (e) => {
    e.preventDefault();
    const user = auth.currentUser;

    if (!user) {
        openLoginModal();
        return;
    }

    document.getElementById("profile-avatar").textContent =
        user.email.charAt(0).toUpperCase();
    document.getElementById("profile-email").textContent = user.email;
    document.getElementById("profile-uid").textContent = user.uid;

    showView(viewProfile);
});

document.getElementById("back-from-profile-btn").addEventListener("click", () => {
    showView(viewHome);
});
