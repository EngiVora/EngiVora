import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname,
});

const eslintConfig = [
	...compat.extends("next/core-web-vitals", "next/typescript"),
	// Global ignores (no files key)
	{
		ignores: [
			"node_modules/**",
			".next/**",
			"**/.next/**",
			"out/**",
			"build/**",
			"next-env.d.ts",
		],
	},
	// Rules applied to our source/config files
	{
		files: [
			"src/**/*.{ts,tsx}",
			"next.config.ts",
			"tailwind.config.js",
			"eslint.config.mjs",
		],
		rules: {
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/triple-slash-reference": "off",
		},
	},
];

export default eslintConfig;
