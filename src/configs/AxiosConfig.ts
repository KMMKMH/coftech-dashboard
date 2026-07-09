import axios from 'axios';
import https from "https";
import { useAuthStore } from '@component/store/auth';
import { i18n } from 'next-i18next';

const httpsAgent =
  process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test"
    ? new https.Agent({ rejectUnauthorized: false })
    : undefined;

const AxiosUrl = axios.create({
  baseURL: process.env.NEXT_PUBLIC_ENDPOINT_URL,
  httpsAgent,
});

AxiosUrl.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

AxiosUrl.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError = error?.response?.data?.error

    if (apiError) {
      const { code, message, statusCode, metadata } = apiError

      const translatedMessage = (() => {
        if (!i18n || !i18n.isInitialized) {
          if (process.env.NODE_ENV === 'development') {
            console.warn('[ErrorNormalizer] i18n not initialized');
          }
          return message || "An error occurred. Please try again.";
        }

        if (code) {
          const translated = String(i18n.t(`errors.${code}`, metadata || {}));

          if (translated && translated !== `errors.${code}`) {
            return translated;
          }

          if (process.env.NODE_ENV === 'development') {
            console.warn(`[ErrorNormalizer] Missing translation for: errors.${code}`);
          }
        }

        const unknownTranslated = String(i18n.t("errors.unknownError"));
        if (unknownTranslated && unknownTranslated !== "errors.unknownError") {
          return unknownTranslated;
        }

        if (message) {
          return message;
        }

        return "Unknown error";
      })();

      error.errorCode = code
      error.translatedMessage = translatedMessage
      error.statusCode = statusCode
      error.metadata = metadata

      if (process.env.NODE_ENV === 'development') {
        console.groupCollapsed(`[API ERROR] ${code}`)
        console.log('Status code:', statusCode)
        console.log('Original message:', message)
        console.log('Translated message:', translatedMessage)
        console.groupEnd()
      }
    }

    return Promise.reject(error)
  }
);


export { AxiosUrl };
