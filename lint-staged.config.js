module.exports = {
  "*.{ts,tsx}": ["eslint --fix", "eslint"],
  "**/*.ts?(x)": () => "npm run check-types",
  "*.{ts,tsx,json,yaml}": ["prettier --write"],
};
