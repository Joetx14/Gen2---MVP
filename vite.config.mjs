import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('aws-amplify')) return 'amplify';
            if (id.includes('react')) return 'react';
            return 'vendor';
          }

          if (id.includes('/src/pages/PlanningSteps/')) return 'planning';
          if (id.includes('/src/pages/')) return 'pages';
          return;
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]' // ✅ keeps image names predictable
      }
    },
    chunkSizeWarningLimit: 700
  }
});
