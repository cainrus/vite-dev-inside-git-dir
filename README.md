# Vite dev server for a project inside a `.git` directory

Some tools keep git worktrees under the repository's own `.git/` directory (so they survive
`git clean -xffd` and stay out of `git status`). Vite's dev server does not work for such a project:
the default `server.fs.deny` and the watcher's default ignore both contain `**/.git/**`, and both are
matched against the absolute path, so every file of the project matches.

```sh
npm install
npm run setup            # copies ./app to .git/inside/app
```

| command | `GET /` | edit `main.js` | edit `node_modules/fake-pkg/index.js` |
|---|---|---|---|
| `npm run dev:outside` (control, `./app`) | 200 | HMR | ignored |
| `npm run dev:inside` | **403** | **nothing** | ignored |
| `npm run dev:inside:opt-in` | 200 | HMR | **picked up** |

Dropping `**/.git/**` from `server.fs.deny` alone fixes serving (200) but not HMR: the watcher still
ignores the project. `dev:inside:opt-in` is the best available workaround: `server.fs.deny` without `**/.git/**` plus
`server.watch.ignored: ['!**/.git/**']`. It works, but the negation also beats the default
`**/node_modules/**` ignore, so a real project would have its whole `node_modules` watched.

Watch the events with `--debug hmr`, e.g. `npm run dev:inside:opt-in -- --debug hmr`.
