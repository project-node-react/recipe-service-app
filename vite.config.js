import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  base: "/recipe-service-app/",
  plugins: [react()],
  build: {
    sourcemap: true,
  },
});
