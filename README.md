# Afterglow Arcade

A responsive, static browser arcade with five playable mini-games. The site has no build step and uses relative asset paths, so it works from both a GitHub Pages user site (`username.github.io`) and a project subpath (`username.github.io/repository-name`).

## Run locally

```sh
python3 -m http.server 4173
```

Then open <http://localhost:4173>.

## Deploy to GitHub Pages

1. Push the repository to GitHub using `main` or `master` as the default branch.
2. Open **Settings → Pages** in the repository.
3. Under **Build and deployment**, choose **GitHub Actions** as the source.
4. Push to the default branch, or run **Deploy to GitHub Pages** manually from the Actions tab.

The included workflow uploads this repository as a static Pages artifact and publishes it. No Node.js installation, package download, API key, or server is required in production.

## Checks

```sh
npm run check
```
