// tailwind.config.js
// import { readFileSync } from "fs";
// import postcss from "postcss";
// import postcssJs from "postcss-js";
import type { Config } from "tailwindcss";
// import plugin from "tailwindcss/plugin";

// const globalCSS = require("./app/globals.css");

// Editor sugestions for new components
// require.extensions[".css"] = function (module, filename) {
//   module.exports = plugin(({ addBase, addComponents, addUtilities }) => {
//     const css = readFileSync(filename, "utf8");
//     const root = postcss.parse(css);
//     const jss = postcssJs.objectify(root);

//     if ("@layer base" in jss) {
//       addBase(jss["@layer base"]);
//     }
//     if ("@layer components" in jss) {
//       addComponents(jss["@layer components"]);
//     }
//     if ("@layer utilities" in jss) {
//       addUtilities(jss["@layer utilities"]);
//     }
//   });
// };

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#555555",
        link: "#1C92FF",
        light: "#8a8a8a",
        white: "#fff",
        black: "#000",
        divider: "#d9d9d936",
        transparent: "#ffffff00",
        mask: "#00000061",

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
    },
  },
  // plugins: [globalCSS],
  plugins: [],
};
export default config;
