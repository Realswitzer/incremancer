# Building Incremancer

<!--incremancer/docs/build/build_guide.md-->

The quickstart version is in the root folder's README, this will run through setting up tools.

Jump to [#Node](#node) if that's installed, if not, jump to [#Bun](#bun).

## Node

If `node` is already installed:

```sh
npm i
npm run build:node
```

This puts the output bundle in `dist/bundle.js`, then a local server can be spun up with `python3 http.server` to play.

NOTE: Due to how PIXI/Angular load other files, it requires an HTTP server.

## Bun

Bun is (mostly) usable as a `node` drop-in, runs faster, etc.

Go to Bun's site [link: bun.com](https://bun.com), use the install command, then run the following:

```sh
bun i
bun run build
```

As stated in the Node section, to play it needs to be put behind an HTTP serverc, so run `python3 http.server` in the root folder (`/path/to/incremancer/`).
