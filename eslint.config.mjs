import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "src/components/blocks/21st-dev/admit-one-3-d-holographic-ticket/admit-one-3-d-holographic-ticket.source.js",
    // Bundled upstream JavaScript; the typed integration is linted normally.
    "src/components/blocks/21st-dev/admit-one-ticket/admit-one-ticket.source.js",
  ]),
]);

export default eslintConfig;
