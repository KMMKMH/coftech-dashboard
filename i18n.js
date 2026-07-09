const NextI18Next = require("next-i18next").default;

const NextI18NextInstance = new NextI18Next({
  defaultLanguage: "es",
  otherLanguages: ["en", "ch"],
});

module.exports = NextI18NextInstance;
module.exports.default = NextI18NextInstance;
