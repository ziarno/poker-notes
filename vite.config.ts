import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { meteor } from 'meteor-vite/plugin'

export default defineConfig({
  plugins: [
    vue({
      script: {
        defineModel: true,
        propsDestructure: true,
      },
    }),
    tailwindcss(),
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
      '/imports': '/imports',
    },
  },
})
