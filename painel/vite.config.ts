import tailwind from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [react(), tailwind()],
	server: {
		port: 5173,
		proxy: {
			"/api": "http://127.0.0.1:3000",
			"/fases": "http://127.0.0.1:3000",
			"/projetos": "http://127.0.0.1:3000",
			"/transicoes": "http://127.0.0.1:3000",
		},
	},
});
