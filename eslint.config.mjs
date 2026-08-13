import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import betterTailwind from "eslint-plugin-better-tailwindcss";
import jsxA11y from "eslint-plugin-jsx-a11y";
import security from "eslint-plugin-security";
import sonarjs from "eslint-plugin-sonarjs";
import unicorn from "eslint-plugin-unicorn";

const house = {
  meta: { name: "house" },
  rules: {
    "no-comments": {
      meta: {
        type: "problem",
        docs: { description: "Names carry the meaning; comments go stale." },
        schema: [],
        messages: { found: "Comments are not allowed. Rename until the code says it." },
      },
      create(context) {
        return {
          Program() {
            for (const comment of context.sourceCode.getAllComments()) {
              context.report({ loc: comment.loc, messageId: "found" });
            }
          },
        };
      },
    },
  },
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  { rules: jsxA11y.flatConfigs.strict.rules },
  sonarjs.configs.recommended,
  unicorn.configs.recommended,
  security.configs.recommended,
  {
    plugins: { house },
    rules: {
      "house/no-comments": "error",
      "react/forbid-dom-props": ["error", { forbid: ["style"] }],
      "react/forbid-component-props": ["error", { forbid: ["style"] }],
      eqeqeq: ["error", "always"],
      "no-console": "error",
      "security/detect-object-injection": "off",
      "unicorn/no-null": "off",
      "unicorn/prevent-abbreviations": "off",
      "unicorn/prefer-global-this": "off",
      "sonarjs/todo-tag": "warn",
      complexity: ["warn", 10],
      "max-depth": ["warn", 4],
      "max-lines": ["warn", { max: 250, skipBlankLines: true, skipComments: true }],
      "max-lines-per-function": [
        "warn",
        { max: 50, skipBlankLines: true, skipComments: true },
      ],
      "max-params": ["warn", 2],
      "max-statements": ["warn", 20],
      "max-classes-per-file": ["error", 1],
      "sonarjs/cognitive-complexity": ["warn", 15],
      "no-magic-numbers": [
        "warn",
        { ignore: [-1, 0, 1, 2], ignoreArrayIndexes: true, enforceConst: true },
      ],
      "id-length": [
        "warn",
        { min: 2, exceptions: ["x", "y", "w", "h", "i", "j", "k", "n", "a", "b", "t"] },
      ],
    },
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: { "better-tailwindcss": betterTailwind },
    settings: {
      "better-tailwindcss": { entryPoint: "src/app/globals.css" },
    },
    rules: {
      ...betterTailwind.configs["correctness-error"].rules,
      ...betterTailwind.configs["stylistic-warn"].rules,
      "better-tailwindcss/enforce-consistent-line-wrapping": "off",
    },
  },
  {
    files: ["src/components/cv/**"],
    rules: { "better-tailwindcss/no-unknown-classes": "off" },
  },
  {
    files: ["src/components/sheet-frame.tsx"],
    rules: { "react/forbid-dom-props": "off" },
  },
  {
    files: ["src/lib/cv/load.ts"],
    rules: { "security/detect-non-literal-fs-filename": "off" },
  },
  {
    files: ["scripts/**"],
    rules: {
      "no-console": "off",
      "security/detect-non-literal-fs-filename": "off",
      "security/detect-non-literal-regexp": "off",
      "sonarjs/no-os-command-from-path": "off",
      "unicorn/no-process-exit": "off",
      "unicorn/prefer-top-level-await": "off",
    },
  },
  {
    files: ["src/lib/scatter.ts"],
    rules: { "no-magic-numbers": "off" },
  },
  {
    files: ["**/*.config.{js,mjs,ts}", "eslint.config.mjs"],
    rules: { "no-magic-numbers": "off" },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
