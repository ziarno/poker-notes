import ViteYaml from '@modyfi/vite-plugin-yaml'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { meteor } from 'meteor-vite/plugin'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    vue({
      script: {
        defineModel: true,
        propsDestructure: true,
      },
    }),
    tailwindcss(),
    ViteYaml(),
    meteor({
      clientEntry: 'client/main.ts',
      serverEntry: 'server/main.ts',
      enableExperimentalFeatures: true,
      stubValidation: {
        ignorePackages: ['meteor/mongo'],
      },
    }),
  ],
  optimizeDeps: {
    exclude: ['vue-meteor-tracker'],
  },
  resolve: {
    alias: {
      '@': '/imports',
    },
  },
})
