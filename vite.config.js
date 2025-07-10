import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    base: "/PhonePageFrontend/",
    plugins: [react()],
    
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    build: {
        rollupOptions: {
            external: [
            ],
            input: {
                main: path.resolve(__dirname, "index.html"),
                404: path.resolve(__dirname, "public/404.html")  // Incluye 404.html
            },
        },
    },
});
