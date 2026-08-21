# Incremancer

Incremancer ported based on old sourcemap

Do note the changes are not fully tested and I cannot attest to how accurate
each version is. Having to constantly run deobfuscators with changing variables
for plenty of commits means theres undoubtedly some things I have missed.

If there are any bugs, regardless of version, I will try my best to make it
replicate the base game, mod, etc.

## Current branches

- dev2: main
  - [github: realswitzer/incremancer:dev2](https://github.com/Realswitzer/incremancer/tree/dev2)
- incremancer: Original base game
  - [github: realswitzer/incremancer:incremancer](https://github.com/Realswitzer/incremancer/tree/incremancer)
  - [github: jamesmgittins/incremancer](https://github.com/jamesmgittins/incremancer)
  - [site: incremancer.gti.nz](https://incremancer.gti.nz/)
- Chalice12: Chalice's Mod (CM)
  - [github: realswitzer/incremancer:Chalice12](https://github.com/Realswitzer/incremancer/tree/Chalice12)
  - [github: Chalice12/incremancer](https://github.com/Chalice12/incremancer)
  - [site: chalice12.github.io/incremancer](https://chalice12.github.io/incremancer)

## Build instructions

This uses `bun build` (or `esbuild` for sourcemaps)

```bash
bun run build # basic build, output in dist/bundle.js
bun run build:sm # or build with sourcemap

bun run dev # starts vite server
```

Since the output build is static, just copying everything and putting it behind Caddy works well enough, or even a `python http.server`. If it can serve static files, it'll work.

```bash
cp -r {dist,images,js,sprites,templates,favicon.ico,index.html,manifest.json,zombiemancer.css} /usr/share/caddy
```

In the future, if I bother with it, maybe there will be a script to help with static deployment.
