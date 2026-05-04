import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  
  // load env file based on `mode` in the current working directory
  // the third parameter '' means allow all env variables to be loaded
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react({
        babel: {
          plugins: [['babel-plugin-react-compiler']],
        },
      }),
    ],
    server: {
      port: Number(env.VITE_FRONTEND_PORT) || 3600,
      strictPort: true,
    },
  }
})