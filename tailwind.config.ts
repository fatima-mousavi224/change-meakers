import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        common: "url('/images/banner.png')",
        about: "url('/images/about/home.jpg')",
        changeMakers: "url('/images/about/Afghan-Girls.png')",
        changeMakersVideo: "url('/images/cta-desktop.jpg')",
        changeMakersVideoMobile: "url('/images/cta-mobile-sm.png')",
        bannerProgram: "url('/images/banner.jpg')",
        bannerAbout: "url('/images/about/hero.png')",
      },
      fontFamily: {
        plusJakartaSans: ["var(--font-plus-jakarta-sans)"],
        arial: ['Arial', 'sans-serif'],
      },

    





      colors: {
        primary: {
          50: "#134c83",
          100: "#114476",
          200: "#0f3d69",
          300: "#0d355c",
          400: "#0b2e4f",
          500: "#0a2642",
          600: "#081e34",
          700: "#061727",
          800: "#040f1a",
          900: "#02080d",
        },
        light_gray: "#F2F2F2",
        dark_gray: "#BEBEBE",
        paragraph_color: "#717171",
        black_color: "#252525",
        primary_color: "#134C83",
        secondary_color: "#E2F1FF",
        ternary_color: "#0F3D69",
        dark: "#222222",
        dashboard_body_bg: "#F4F7FE",
      },
      keyframes: {},
      animation: {},
    },
  },
  plugins: [require("@tailwindcss/forms")],
} satisfies Config;
