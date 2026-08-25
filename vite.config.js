import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig(({ command }) => {
  return {
    base: command === 'build' ? '/recipe-service-app/' : '/',

    plugins: [react()],
    build: {
      sourcemap: true,
    },
  };
});
