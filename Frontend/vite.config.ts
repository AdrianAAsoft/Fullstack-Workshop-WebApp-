import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';


//que el front detecte como api al back
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: { '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});