import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Production builds are served from GitHub Pages at /SparkShelf/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/SparkShelf/' : '/',
}))
