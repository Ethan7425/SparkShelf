# SparkShelf

SparkShelf helps you keep track of Instagram posts you want to revisit. Saves are stored in your browser's `localStorage`; there is no account or backend.

## Run locally

```sh
npm install
npm run dev
```

## Features

- Save Instagram post and Reel links with a title, plus an optional description and tags.
- Set up your own tags in Settings, each with an icon and a color. Pick them as buttons when saving and see them on every card.
- Add a link with the + button; the Paste button reads an Instagram link from the clipboard.
- Tap a card to open the post. On a phone, swipe a card right to favorite it or left to delete it.
- Edit titles, descriptions and tags, favorite saves, or delete them (with a confirmation).
- Forgiving search across titles, descriptions, tags and links that tolerates small typos; filter by tag or favorites; sort by date or title.
- Stats in Settings: totals, saves per tag and saves per month.
- Export a backup and import it again (Settings > Backup). Imports skip saves you already have.
- Pick a style in Settings: Editorial, Neo-brutalism, Bento, Japandi, Frutiger Aero or VHS, each in light and dark.
- On phones, dialogs open as bottom sheets you can drag down to close.
- Install as a PWA and reopen the app offline after the first visit.

Your saves live in the `saves` key, your tags in `sparkshelf-tags`, and your style and mode in `sparkshelf-style` and `sparkshelf-theme` in this browser's local storage. They are not synced across devices. Export a JSON copy if you want a backup.

## iPhone Shortcut

The in-app guide (book icon) walks through a Shortcut that copies the shared Instagram link and opens the Home Screen web app with `webapp://<host>/SparkShelf/`. In the app, tap **+** and then **Paste**. The form pulls the Instagram link out of any surrounding text.

The app also accepts a link through the `share` query parameter (`https://<host>/SparkShelf/?share=<encoded link>`) and opens a save dialog with it filled in. That route opens in Safari, which has storage separate from the Home Screen app.

## Production build

```sh
npm run build
npm run preview
```

## Deploy to GitHub Pages

Every push to `main` deploys automatically. The workflow in `.github/workflows/deploy.yml` builds the site on GitHub and publishes `dist/` to Pages.

One-time setup: in the repository, open **Settings > Pages > Build and deployment** and set **Source** to **GitHub Actions**. The site is served at `https://<username>.github.io/SparkShelf/`.

Production builds use the base path `/SparkShelf/` (see `vite.config.js`), so the repository must keep that name. The dev server uses `/`.
