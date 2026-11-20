# GUILDA Documentation

Source of the GUILDA documentation site, <https://guilda-dev.github.io/guilda-doc/>:
Home, About, Getting Started, Tutorial and the lecture notes (`lecture/`).

GUILDA itself is developed in [guilda-dev/guilda](https://github.com/guilda-dev/guilda),
where this repository is checked out as the submodule `_GUILDAdocPages`. The class reference,
the For Developer pages and the update log change with the code, so they stay in that
repository and are published on its own site,
<https://guilda-dev.github.io/guilda/_GUILDAdoc/index.html>; the header of `index.html` links there.

The pages are static HTML and work from `file://` as well; open `index.html` in a browser.
GitHub Pages serves the `main` branch from the repository root (`.nojekyll` turns off Jekyll).

Third-party files in `vendor/` keep their own licenses; see [`vendor/README.md`](vendor/README.md).

The folders `Reference/`, `SeriesAnalysis/`, `SetEnvironment/`, `SourceCode/` and `aboutPowerSystem/`
hold only redirect pages: they keep the URLs of the old MkDocs site (until 2026) working by
forwarding each page to its new place.
