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
| `npm run dev:inside:narrow` | 200 | HMR | ignored |

Dropping `**/.git/**` from `server.fs.deny` alone fixes serving (200) but not HMR: the watcher still
ignores the project. Both opt-in variants also un-ignore the project in the watcher, where a matching
negation beats every ignore pattern, the default `**/node_modules/**` included:

- `dev:inside:opt-in` uses `!**/.git/**`. It matches everything under the project, so `node_modules`
  gets watched too.
- `dev:inside:narrow` uses a negation for the root itself and every path under it with no
  `node_modules` segment at any depth (see `app/vite.config.js`). It works, but only if you know that
  negations win and write an extglob that re-states the default ignores.

Watch the events with `--debug hmr`, e.g. `npm run dev:inside:narrow -- --debug hmr`.
