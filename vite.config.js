import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    lightningcss: {
      // foundation.min.css incluye un hack para IE (`@media (min-width:0\0)`)
      // que LightningCSS no acepta; con errorRecovery simplemente se descarta.
      errorRecovery: true,
    },
  },
});
