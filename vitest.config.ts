/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    exclude: ['**/node_modules/**', '**/e2e/**', '**/tests/e2e/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        'dist/',
        'out/',
        'public/',
        'database/',
        'src/vite-env.d.ts'
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    },
    // Mock environment variables for testing
    env: {
      VITE_PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
      VITE_PUBLIC_SUPABASE_ANON_KEY: 'test-anon-key',
      VITE_APP_ENV: 'test',
      VITE_APP_VERSION: '1.0.0-test',
      VITE_ENCRYPTION_KEY: 'test-encryption-key-32-characters'
    }
  },
})
