/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,ts}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#4F46E5', // Indigo 600
                secondary: '#10B981', // Emerald 500
                dark: '#1F2937', // Gray 800
                light: '#F3F4F6', // Gray 100
            }
        },
    },
    plugins: [],
}
