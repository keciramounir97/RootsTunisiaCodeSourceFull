/**
 * Tailwind CSS Configuration — Roots Tunisia
 * Tunisia visual identity: parchment cream, Carthage gold, Tunisian red, olive, ink
 */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      // ===========================================
      // CUSTOM BREAKPOINTS
      // ===========================================
      screens: {
        "xs-400": "400px",
        "xs-500": "500px",
        "xs-600": "600px",
        "sm-700": "700px",
        "sm-800": "800px",
        "md-900": "900px",
        "md-1000": "1000px",
        "md-1100": "1100px",
        "lg-1200": "1200px",
        "lg-1300": "1300px",
        "lg-1400": "1400px",
        "xl-1500": "1500px",
        "xl-1600": "1600px",
        "xl-1700": "1700px",
        "2xl-1800": "1800px",
        "2xl-1900": "1900px",
        "2xl-2000": "2000px",
        "3xl-2100": "2100px",
        "3xl-2200": "2200px",
        "3xl-2300": "2300px",
        "4xl-2400": "2400px",
        "4xl-2500": "2500px",
      },
      // ===========================================
      // TUNISIA COLOR PALETTE
      // Parchment + Carthage Gold + Tunisian Red + Olive + Ink
      // ===========================================
      borderRadius: {
        sm: "2px",
        DEFAULT: "4px",
        md: "6px",
        lg: "8px",
        xl: "10px",
        "2xl": "12px",
        "3xl": "14px",
      },
      colors: {
        /* Dark mode surfaces */
        dark1: "#1a1410",
        dark2: "#241e18",
        /* Neutrals */
        grayTn: "#8a7e72",
        lightTn: "#f7f2e8",
        /* Tunisia brand colors */
        brand: "#c8102e",         /* Tunisian flag red */
        brandDark: "#a50d24",
        accent: "#d9a441",        /* Carthage gold */
        accentDark: "#b8862e",
        teal: "#4a7c59",          /* Olive green */
        tealDark: "#3a6148",
        /* Heritage Palette */
        "primary-brown": "#2a1f15",
        "secondary-brown": "#3d2e20",
        "accent-gold": "#d9a441",
        "light-beige": "#f7f2e8",
        "dark-beige": "#ede5d5",
        "paper-color": "#faf6ef",
        "leather-brown": "#5a3e28",
        "deep-brown": "#1a0f0a",
        "dark-coffee": "#1a1410",
        "text-color": "#2a1f15",
        "olive-green": "#4a7c59",
        /* Tunisian Red */
        "tunisia-red": "#c8102e",
        "tunisia-red-dark": "#a50d24",
      },
      backgroundImage: {
        tnGradient: "linear-gradient(100deg, #d9a441, #e8c47a, #d9a441)",
        tnRedGradient: "linear-gradient(135deg, #c8102e, #e74c3c)",
      },
      fontFamily: {
        cinzel: ["Cormorant Garamond", "Cinzel", "serif"],
        display: ["Cormorant Garamond", "Times New Roman", "serif"],
        body: ["Karla", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["Karla", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
