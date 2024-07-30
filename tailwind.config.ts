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
        reddy: "blue",
      },
    },
  },
  // plugins: [globalCSS],
  plugins: [],
};
export default config;
