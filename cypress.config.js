import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    baseUrl: 'http://localhost:5173',
    viewportHeight: 896,
    viewportWidth: 414,
    watchForFileChanges: false,
    defaultCommandTimeout: 10000,
    video: false,
    trashAssetsBeforeRuns: false,
    async setupNodeEvents(on, config) {
      const { default: setupNodeEvents } = await import('./cypress/plugins/index.js');
      return setupNodeEvents(on, config);
    },
    testIsolation: false
  },
});
