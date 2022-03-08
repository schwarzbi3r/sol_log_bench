module.exports = {
    root: true,
    env: {
        es6: true,
        node: true,
    },
    parser: "@typescript-eslint/parser",
    plugins: [
        "@typescript-eslint",
    ],
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
    ],
    rules: {
        "indent": ["error", 4],
        "quotes": ["error", "double"],
        "comma-dangle": ["error", "only-multiline"],
        "semi-style": ["error", "last"],
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    },
};