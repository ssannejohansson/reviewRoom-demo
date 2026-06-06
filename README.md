# Review Room

A static website for discovering and reading reviews of TV shows. Browse 40 curated shows across drama, crime, thriller, and more — no account required.

> This is a static rebuild of a full stack project that originally used an Express/TypeScript backend, PostgreSQL database, Prisma ORM, and Docker. Show and review data is now served from a local JS file instead of a REST API. View the original project [here](https://github.com/ssannejohansson/ReviewRoom.git).

## Tech stack

- Vanilla HTML, CSS, and JavaScript (ES modules, no build step)
- Deployed on GitHub Pages

## Run locally

```bash
npm run dev
```

Then open [http://localhost:5500](http://localhost:5500).

## Deploy to GitHub Pages

1. Push the repository to GitHub
2. Go to **Settings → Pages**
3. Set source to **Deploy from a branch**, select `main` and `/ (root)`

## Project structure

```
├── index.html
├── package.json
├── css/
│   └── style.css
├── js/
│   ├── app.js            # main logic and event handlers
│   ├── data.js           # all show and review data
│   └── ui.js             # pure render functions
└── assets/
    ├── site.webmanifest
    └── favicons
```

## Features

- Browse 40 TV shows with poster images, genre, year, and ratings
- Click any show to read its reviews and average star rating
- Responsive layout with mobile navigation

