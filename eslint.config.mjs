import { FlatCompat } from "@eslint/eslintrc";
import eslintConfigPrettier from "eslint-config-prettier";
import pluginPrettier from "eslint-plugin-prettier";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
   baseDirectory: __dirname,
});

const eslintConfig = [
   // Next.js + TypeScript recommended rules
   ...compat.extends("next/core-web-vitals", "next/typescript"),
   eslintConfigPrettier,

   // Prettier integration
   ...compat.extends("prettier"), // Spread the Prettier config instead of `extends`

   {
      files: ["**/*.{js,jsx,ts,tsx}"],

      plugins: {
         prettier: pluginPrettier,
      },
      rules: {
         // "prettier/prettier": "error",
         "@typescript-eslint/indent": "off",
         indent: "off",
      },
   },

   // Global ignores
   {
      ignores: [
         "node_modules/**",
         ".next/**",
         "out/**",
         "build/**",
         "next-env.d.ts",
         "prisma/migration/**",
         "src/generated/**",
      ],
   },
];

export default eslintConfig;
