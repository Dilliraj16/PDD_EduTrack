/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
    darkMode: "class",
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                cyber: '#00d2ff',
                faculty: '#a200ff',
                admin: '#ff0055',
                parent: '#00ff73',
            },
        },
    },
    plugins: [],
}
