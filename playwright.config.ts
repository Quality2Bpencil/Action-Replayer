// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testMatch: [
    'recordings/**/*.spec.ts'
  ]
});