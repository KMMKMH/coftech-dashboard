import { format, parseISO } from "date-fns";
import { enUS, es, zhCN } from "date-fns/locale";
import { i18n } from "next-i18next";

const localeMap = {
  en: enUS,
  es: es,
  ch: zhCN,
};

export const formatDate = (dateString: string): string => {
  const date = parseISO(dateString);
  const currentLocale = i18n.language || "en";
  const locale = localeMap[currentLocale] || enUS;
  return format(date, "PPP", { locale });
};
