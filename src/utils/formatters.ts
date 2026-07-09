import { MESSAGE } from "@component/constants/message";
import { enUS, es, zhCN } from "date-fns/locale";
import { i18n } from "next-i18next";
import { format } from "date-fns";

export const formatDate = (dateString) => {
    const date = new Date(Number(dateString));
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
};


export const formatDate2 = (dateString: string): string => {
    if (dateString == "null" || dateString == undefined) return "";

    const milliseconds = Number(dateString) * 1000;
    const date = new Date(milliseconds);

    const localeMap = {
        en: enUS,
        es: es,
        ch: zhCN,
    };

    const currentLocale = i18n.language || "en";
    const locale = localeMap[currentLocale] || enUS;

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${format(date, MESSAGE.DATE_FORMAT, { locale })} ${hours}:${minutes}`;
};

export const formatPhoneNumber = (phone) => {
    if (phone) {
        if (!phone.startsWith("+")) {
            phone = `+${phone}`;
        }
        return phone.replace(/(\+\d{3})(\d{4})(\d{4})/, "$1 $2-$3");
    }
    return phone;
};

export function formatTime(seconds) {
    const milliseconds = seconds * 1000;
    return new Date(milliseconds).toISOString().substr(14, 5);
}
