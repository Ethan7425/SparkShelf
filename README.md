# SparkShelf

SparkShelf helps you keep track of Instagram posts you want to revisit. Saves are stored in your browser's `localStorage`; there is no account or backend.

## Run locally

```sh
npm install
npm run dev
```

## Features

- Save Instagram post and Reel links with a title, plus an optional description and tags.
- Set up your own tags, each with an icon, in Settings (gear icon). Pick them as buttons when saving, see them on each card, and filter by tapping them above your shelf.
- Add a link by hand with the + button next to Export.
- Edit titles, descriptions and tags, favorite saves, or delete them (with a confirmation).
- Search across titles, links, descriptions, and tags; sort by date or title.
- Export your collection as JSON.
- Pick a style in Settings: Editorial, Neo-brutalism, Bento, Japandi, Frutiger Aero or VHS, each in light and dark.
- Install as a PWA and reopen the app offline after the first visit.
- Save straight from Instagram's Share menu on iPhone with an Apple Shortcut (setup guide in the app's book icon).

Your saves live in the `saves` key, your tags in `sparkshelf-tags`, and your style and mode in `sparkshelf-style` and `sparkshelf-theme` in this browser's local storage. They are not synced across devices. Export a JSON copy if you want a backup.

## iPhone Shortcut

The app accepts a link through the `share` query parameter, for example `https://your-site/?share=<encoded Instagram link>`, and opens a save dialog with the link filled in. The in-app guide walks through building a Shortcut that does this. It needs the app to be deployed on an HTTPS address.

## Production build

```sh
npm run build
npm run preview
```

## Deploy to GitHub Pages

Deployment is manual. `npm run build` writes the site to `dist/` with the base path `/SparkShelf/`, so it works at `https://<username>.github.io/SparkShelf/`. Publish the contents of `dist/` to the branch your Pages site serves from (for example a `gh-pages` branch, chosen under **Settings > Pages > Build and deployment > Deploy from a branch**). The dev server still uses `/`.
