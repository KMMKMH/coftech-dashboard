import { ApiErrorShape, BackendError, GraphQLErrorShape, NormalizedError } from "@component/types/errors";
import { i18n } from "next-i18next";

export const normalizeApiError = (error: BackendError): NormalizedError => {
  let apiError: ApiErrorShape | undefined;
  let graphQL: GraphQLErrorShape | undefined;

  if ("graphQLErrors" in error && error.graphQLErrors?.length) {
    graphQL = error.graphQLErrors[0];
  } else if ("data" in error) {
    const data = error.data;
    if (data && typeof data === "object" && "error" in data) {
      apiError = (data as { error: ApiErrorShape }).error;
    }
  }

  if (!apiError && ("code" in error || "message" in error)) {
    apiError = error as ApiErrorShape;
  }

  let code: string | undefined;
  let message: string | undefined;
  let metadata: Record<string, any> | undefined;
  let statusCode: number | undefined;

  if (graphQL) {
    message = graphQL.message;
    const extensions = graphQL.extensions || {};
    ({ code, metadata, statusCode } = extensions);
  } else if (apiError) {
    ({ code, message, metadata, statusCode } = apiError);
  } else {
    return { translatedMessage: i18n?.t("errors.unknownError") };
  }

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

  return {
    errorCode: code,
    translatedMessage,
    metadata,
    statusCode,
  };
};