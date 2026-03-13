# incremancer-port

An unofficial project porting Incremancer to a more modern system, recreating the Typescript source code, and aiming to maintain a better codebase.

## Branches

Temporarily, this project maintains lots of branches with various purposes. Use `prod` if in doubt.

| Branch                                                                           | Purpose                                                                                                                                                        |
| -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`dev`](https://github.com/Realswitzer/incremancer/tree/dev)                     | Default branch, unstable -- use `prod`                                                                                                                         |
| [`prod`](https://github.com/Realswitzer/incremancer/tree/prod)                   | incremancer-port, stable, fully functional and tested                                                                                                          |
| [`deobf`](https://github.com/Realswitzer/incremancer/tree/deobf)                 | Attempting to reverse `dist/bundle.js` into usable stuff, broken, used as reference                                                                            |
| [`deobf_staging`](https://github.com/Realswitzer/incremancer/tree/deobf_staging) | Intended for `deobf`'s effective `prod`. Broken, do not use, will be removed.                                                                                  |
| [`master`](https://github.com/Realswitzer/incremancer/tree/master)               | Fork of `CirusDane/incremancer@0820c5993fd38dbd95577e22a5e2695f517e4d18`, original intent was to build off of that, but proved too ineffective (hence `deobf`) |

## Running

This project uses `pnpm`, and will be tested against `bun` before being pushed to `prod`, but functionally will be kind of the same.

Building does not work yet, and it will *hopefully* be fixed soon™ to allow for static deployments, such as via GitHub Pages, local files, or a basic `http.server`. Use `vite dev` to start a server in the meantime.

```sh
$ git clone -b prod --single-branch --depth 1 https://github.com/Realswitzer/incremancer
# with gh
$ gh repo clone Realswitzer/incremancer -- -b prod --single-branch --depth 1
# --single-branch and --depth 1 aim to keep cloning quick, for development consider increasing or removing --depth.

$ cd incremancer
$ pnpm i
$ pnpm run dev
```

## Outline

incremancer-port started as an idea of recreating Incremancer in such a way that it was actually possible to edit the "source code" (as of latest commits, `dist/bundle.js`, a hellish Webpack bundle), add more features easily, and overall, just make it possible to, well, do anything useful.

## Forks

Officially, this is a fork and port-in-progress of [CirusDane/incremancer@0820c59](https://github.com/CirusDane/incremancer/commit/0820c5993fd38dbd95577e22a5e2695f517e4d18) starting on the latest official version with source code, [incremancer@0b921f4](https://github.com/jamesmgittins/incremancer/commit/0b921f429dc928529e43ed634049936c1e277087). This is detached from the forks due to being independent enough, and approaches modding differently. As I port commits, any extra contributors will be credited to the best of my ability.

```
.
└── https://github.com/CirusDane/incremancer
    └── https://github.com/Chalice12/incremancer
        └── https://github.com/jamesmgittins/incremancer
```

# Credits

- [jamesmgittins](https://github.com/jamesmgittins): Creating the game, active until July 2019-Mar 2021
- [Chalice12](https://github.com/Chalice12): Original community mod, Apr 2022-Mar 2023
- [CirusDane](https://github.com/CirusDane): Latest community mod, Oct 2023-Dec 2025
- [Tenp0ralAnomaly](https://github.com/Temp0ralAnomaly): Code contributor for CirusDane's fork, Apr 2025-Sep 2025
- You: Having to read this README.