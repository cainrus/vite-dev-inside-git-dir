import { defineConfig } from 'vite'

// OPT_IN=1 is the best a user can do today for a project that lives inside a .git directory:
// drop `**/.git/**` from server.fs.deny and un-ignore it in the watcher.
const optIn = process.env.OPT_IN === '1'

export default defineConfig({
  server: optIn
    ? {
        fs: { deny: ['.env', '.env.*', '*.{crt,pem,key,p12,pfx,cer,der}', '.npmrc', '.yarnrc.yml'] },
        watch: { ignored: ['!**/.git/**'] },
      }
    : {},
})
