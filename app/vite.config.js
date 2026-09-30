import { defineConfig } from 'vite'

// What a user can do today for a project that lives inside a .git directory:
// drop `**/.git/**` from server.fs.deny and un-ignore the project in the watcher.
//   OPT_IN=1       `!**/.git/**` - also un-ignores node_modules
//   OPT_IN=narrow  a negation matching the root and every path with no node_modules segment
const root = import.meta.dirname
const watchNegation = {
  1: '!**/.git/**',
  narrow: `!${root}{,/*(!(node_modules)/)!(node_modules)}`,
}[process.env.OPT_IN]

export default defineConfig({
  server: watchNegation
    ? {
        fs: { deny: ['.env', '.env.*', '*.{crt,pem,key,p12,pfx,cer,der}', '.npmrc', '.yarnrc.yml'] },
        watch: { ignored: [watchNegation] },
      }
    : {},
})
