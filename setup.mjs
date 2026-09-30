// Puts a copy of ./app inside this repository's .git directory - the same place a tool that keeps
// git worktrees under .git/ would put a checkout - with a stand-in installed package next to it.
import { cpSync, mkdirSync, writeFileSync } from 'node:fs'

cpSync('app', '.git/inside/app', { recursive: true })
mkdirSync('.git/inside/app/node_modules/fake-pkg', { recursive: true })
writeFileSync('.git/inside/app/node_modules/fake-pkg/index.js', 'export default 1\n')
console.log('app copied to .git/inside/app')
