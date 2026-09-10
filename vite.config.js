import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const GITHUB_PAGES_BASE = '/elexoplus/'

export default defineConfig(({ command }) => ({
  base: command === 'build' ? GITHUB_PAGES_BASE : '/',

  plugins: [
    react(),
    tailwindcss(),

    {
      name: 'fix-public-assets-for-github-pages',

      transformIndexHtml(html) {
        if (command !== 'build') return html

        return html.replace(
          /(["'(])\/assets\//g,
          `$1${GITHUB_PAGES_BASE}assets/`
        )
      },

      generateBundle(_options, bundle) {
        if (command !== 'build') return

        for (const file of Object.values(bundle)) {
          if (file.type !== 'chunk') continue

          file.code = file.code.replace(
            /(["'`])\/assets\//g,
            `$1${GITHUB_PAGES_BASE}assets/`
          )
        }
      },
    },
  ],
}))
