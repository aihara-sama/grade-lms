import { readFileSync } from "fs";
import postcss from "postcss";
import postcssJs from "postcss-js";
import plugin from "tailwindcss/plugin";

import type { Config } from "tailwindcss";

// Editor sugestions for custom css classes
require.extensions[".css"] = function (module, filename) {
  module.exports = plugin(({ addBase, addComponents, addUtilities }) => {
    const css = readFileSync(filename, "utf8");
    const root = postcss.parse(css);
    const jss = postcssJs.objectify(root);

    if ("@layer base" in jss) {
      addBase(jss["@layer base"]);
    }
    if ("@layer components" in jss) {
      addComponents(jss["@layer components"]);
    }
    if ("@layer utilities" in jss) {
      addUtilities(jss["@layer utilities"]);
    }
  });
};

const config: Config = {
  content: ["./app/**/*.tsx", "./components/**/*.tsx"],
  theme: {
    extend: {
      keyframes: {
        timeoutLine: {
          "0%": { width: "100%" },
          "100%": { width: "0%" },
        },
      },
      animation: {
        "timeout-line": "timeoutLine linear forwards",
      },
      colors: {
        primary: "#555555",
        link: "#1C92FF",
        light: "#8a8a8a",
        white: "#fff",
        black: "#000",
        divider: "#d9d9d936",
        transparent: "#ffffff00",
        mask: "#00000061",

        amber: {
          500: "#fbbf24",
          520: "#f2b311",
          550: "#d89c00",
        },

        blue: {
          100: "#3D9BF1",
          200: "#3194ee",
          300: "#0e7fe7",
        },
        dark: {
          "100": "#00000029",
          "200": "#00000069",
        },
        gray: {
          100: "#f6f6f6",
          200: "#e9e9e9",
          500: "#d9d9d9",
        },
      },
      transitionProperty: {
        fade: "visibility, transform, opacity",
      },
      screens: {
        "sm-h": { raw: "(min-height: 500px)" },
      },
    },
  },
  // eslint-disable-next-line
  plugins: [require("./styles/globals.css")],
};
export default config;
