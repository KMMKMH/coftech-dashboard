/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ["page.tsx", "page.ts", "page.jsx", "page.js"],
};

const { i18n } = require("./next-i18next.config");

module.exports = {
  ...nextConfig,
  i18n,
};
