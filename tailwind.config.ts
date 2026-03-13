import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                'deep-black': '#0B0B0F',
                'shadow-tone': '#121212',
                'crimson': '#8B0000',
                'crimson-glow': 'rgba(139, 0, 0, 0.35)',
                'text-primary': '#EAEAEA',
                'text-muted': '#9CA3AF',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
};

export default config;
