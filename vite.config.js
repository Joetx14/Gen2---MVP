import { defineConfig } from 'vite';
import crypto from 'crypto';
globalThis.crypto = crypto;

export default defineConfig({
  // ...existing config...
});