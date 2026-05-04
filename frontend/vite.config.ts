import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig(({ mode }) => {


    /*
        the first parameter `mode` is the mode that Vite is running
        in (e.g. 'development', 'production', 'test')
        the second parameter `__dirname` is the absolute path to the
        directory of the current file (vite.config.ts)
        the third parameter '' means allow all env variables to be loaded
    */
    const env = loadEnv(mode, __dirname, '')

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