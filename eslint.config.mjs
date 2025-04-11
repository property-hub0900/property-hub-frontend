import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Extend recommended configs from Next.js and TypeScript
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    // Files to lint (only lint source files, not build output)
    files: ["src/**/*.{js,ts,tsx}"],
    // Files and directories to ignore
    ignores: [
      "build/**", // Ignore build output
      "dist/**", // Ignore distribution folder
      ".next/**", // Ignore Next.js build folder
      "node_modules/**", // Ignore node_modules
      "*.config.js", // Ignore config files (like this one)
      "*.json", // Ignore JSON files
    ],
    rules: {
      // Turn off specific rules that might cause errors
      "@typescript-eslint/no-explicit-any": "off", // Already in your config
      "no-unused-vars": "ignore", // Downgrade to warning
      "@typescript-eslint/no-unused-vars": "warn", // Downgrade to warning
      "react/no-unescaped-entities": "off", // Ignore React entity errors

      // Add more rules to disable as needed
      // Enforces the Rules of Hooks
      // React Hooks specific rules
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // Additional recommended React rules
      "react/jsx-uses-react": "error",
      "react/jsx-uses-vars": "error",
    },
  },
];

export default eslintConfig;
