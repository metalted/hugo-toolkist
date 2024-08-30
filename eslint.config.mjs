import globals from "globals";

export default [
  {
    languageOptions: {
      globals: globals.browser,
      ecmaVersion: "latest", // or the specific ECMAScript version you're using
      sourceType: "module",
    },
    rules: {
      // Disable all rules by setting them to "off"
      "no-unused-vars": "off",
      "no-undef": "off",
      // Add more rules here if needed
    }
  }
];