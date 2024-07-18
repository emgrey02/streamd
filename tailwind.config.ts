import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                'brand-blue': '#95B4E1',
            },
            maxHeight: {
                '600': '600px',
            },
        },
    },
    plugins: [],
};
export default config;
