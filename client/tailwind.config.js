/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                govt: {
                    blue: '#1a365d',
                    gold: '#c5a017',
                    light: '#f3f4f6'
                }
            }
        },
    },
    plugins: [],
}
