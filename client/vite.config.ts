import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), "");
	const apiUrl = env.VITE_API_URL || "http://localhost:3000";

	return {
		plugins: [react()],
		resolve: {
			alias: {
				"@": fileURLToPath(new URL("./src", import.meta.url)),
			},
		},
		server: {
			port: 5173,
			proxy: {
				"/api": {
					target: apiUrl,
					changeOrigin: true,
				},
			},
		},
	};
});
