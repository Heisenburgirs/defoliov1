import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    screens: {
      sm: "250px",
      base: "420px",
      keymanager: "540px",
      extension: "579px",
      extension2: "588px",
      md: "768px",
      lg: "1100px",
      xl: "1400px"
    },
    borderRadius: {
      "1000": "1000px",
      "150": "12px",
      "100": "8px",
      "50": "4px",
      "25": "2px",
      full: "360px"
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))"
      },
      boxShadow: {
        "bottom-100": "0px 1px 2px 0px rgba(27, 36, 44, 0.12)",
        "bottom-200":
          "0px 2px 8px -1px rgba(27, 36, 44, 0.08), 0px 2px 2px -1px rgba(27, 36, 44, 0.04)",
        "bottom-300":
          "0px 8px 16px -2px rgba(27, 36, 44, 0.12), 0px 2px 2px -1px rgba(27, 35, 44, 0.04)",
        "bottom-400":
          "0px 16px 24px -6px rgba(27, 36, 44, 0.16), 0px 2px 2px -1px rgba(27, 36, 44, 0.04)",
        "top-100": "0px -1px 2px 0px rgba(27, 36, 44, 0.12)",
        "top-200":
          "0px -2px 8px -1px rgba(27, 36, 44, 0.08), 0px -2px 2px -1px rgba(27, 36, 44, 0.04)",
        "top-300":
          "0px -8px 16px -2px rgba(27, 36, 44, 0.12), 0px -2px 2px -1px rgba(27, 35, 44, 0.04)",
        "top-400":
          "0px -16px 24px -6px rgba(27, 36, 44, 0.16), 0px -2px 2px -1px rgba(27, 36, 44, 0.04)"
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"]
      },
      fontSize: {
        xsmall: "0.625rem",
        small: "0.75rem",
        base: "0.875rem",
        large: "1rem",
        logo: "1.25rem",
        header: "2rem"
      },
      lineHeight: {
        caption: "1rem",
        small: "1.25rem",
        base: "1.5rem",
        header: "2.75rem"
      },
      fontWeight: {
        regular: "400",
        semibold: "600"
      },
      keyframes: {
        // Currency dropdown animation
        "popup-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" }
        },
        "popup-out": {
          "0%": { transform: "scale(1)", opacity: "1" },
          "100%": { transform: "scale(0.95)", opacity: "0" }
        },

        // Keymanager dropdown animation
        reveal: {
          "0%": { maxHeight: "0" },
          "100%": { maxHeight: "1500px" }
        },
        conceal: {
          "0%": { maxHeight: "1500px" },
          "100%": { maxHeight: "0" }
        },

        // Keymanager Add Controller
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        fadeOut: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        }
      },

      animation: {
        // Currency dropdown animation
        "popup-in": "popup-in 0.2s ease-out forwards",
        "popup-out": "popup-out 0.2s ease-out forwards",

        // Keymanager dropdown animation
        reveal: "reveal 0.5s ease-in-out forwards",
        conceal: "conceal 0.5s ease-in-out forwards",

        // Keymanager Add Controller
        "fade-in": "fadeIn 0.2s ease-in-out forwards",
        "fade-out": "fadeOut 0.2s ease-in-out forwards"
      }
    },
    colors: {
      // light mode | dark mode
      'primary-50': '#FFF7F7',
      'primary-100': '#FDDCDB',
      'primary-200': '#FCB8BE',
      'primary-300': '#F893A6',
      'primary-400': '#F2779A',
      'primary-500': '#EA4C89',
      'primary-600': '#C9377E',
      'primary-700': '#A82672',
      'primary-800': '#871864',
      'primary-900': '#700E5B',

      'secondary-50': '#EEFFFD',
      'secondary-100': '#DEFCF8',
      'secondary-200': '#BEFAF7',
      'secondary-300': '#9BEFF1',
      'secondary-400': '#7EDAE4',
      'secondary-500': '#55BDD3',
      'secondary-600': '#3E97B5',
      'secondary-700': '#2A7497',
      'secondary-800': '#1B547A',
      'secondary-900': '#103C65',

      'positive-50': '#F7FFF1',
      'positive-100': '#EEFCE5',
      'positive-200': '#DAF9CD',
      'positive-300': '#BCEDAE',
      'positive-400': '#9CDC93',
      'positive-500': '#72C56E',
      'positive-600': '#50A953',
      'positive-700': '#378D41',
      'positive-800': '#237233',
      'positive-900': '#155E2A',

      'negative-50': '#FFF4EC',
      'negative-100': '#FEE6D7',
      'negative-200': '#FEC7AF',
      'negative-300': '#FCA186',
      'negative-400': '#FA7D68',
      'negative-500': '#F84337',
      'negative-600': '#D5282B',
      'negative-700': '#B21B2B',
      'negative-800': '#8F1129',
      'negative-900': '#770A27',
      
      'warning-50': '#FFFBEE',
      'warning-100': '#FEF6D9',
      'warning-200': '#FEEBB3',
      'warning-300': '#FDDC8D',
      'warning-400': '#FBCD70',
      'warning-500': '#FAB642',
      'warning-600': '#D79330',
      'warning-700': '#B37221',
      'warning-800': '#905515',
      'warning-900': '#77400C',
      
      'neutral-0': '#FFFFFF',
      'neutral-50': '#F8F8F8',
      'neutral-100': '#F1F1F1',
      'neutral-200': '#D6D8DB',
      'neutral-300': '#BABCBE',
      'neutral-400': '#7D8286',
      'neutral-500': '#41474D',
      'neutral-600': '#383F45',
      'neutral-700': '#2B3239',
      'neutral-800': '#1C2126',
      'neutral-900': '#171B1F',

      "background-darktheme": "#1C2126",

      //old and gay
      background: "#f8fafb",
      black: "#000000",
      white: "#ffffff",
      pink: "#EE6EA3",
      darkBlue: "#1A3042",
      lightPink: "rgb(255, 160, 213)",
      green: "#4cca61",
      red: "#ca4c4c",
      lightGrey: "#E0E0E0"
    }
  },
  plugins: []
}
export default config
