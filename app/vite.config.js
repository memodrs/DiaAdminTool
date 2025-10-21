import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createHtmlPlugin } from 'vite-plugin-html'

export default defineConfig({
  plugins: [
    vue(),
    createHtmlPlugin({
      // optional: eigene Optionen
      minify: false, // wenn du HTML nicht minifizieren willst
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src/js/', import.meta.url))
    }
  }
})
