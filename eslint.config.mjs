import js from "@eslint/js";
import openlayers from "eslint-config-openlayers";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig({
  files: ["**/*.{js,mjs,cjs,ts,mts}"],
  extends: [
    js.configs.recommended,
    tseslint.configs.recommended,
    ...openlayers,
    eslintConfigPrettier,
  ],
});
