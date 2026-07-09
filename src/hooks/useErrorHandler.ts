import { BackendError, VALIDATION_ERROR_TYPES, ValidationErrorType } from "@component/types/errors";
import { useError } from "@component/utils/errorContext";
import { normalizeApiError } from "@component/utils/errorNormalizer";
import { isTemporaryAccessEnabled } from "@component/utils/temporaryAccess";
import { i18n } from "next-i18next";
import { useCallback } from "react";

const useErrorHandler = () => {
  const { showError } = useError();

  type FormFields = Record<string, any>;

  const handleError = useCallback((error: BackendError, fields?: FormFields) => {
    if (isTemporaryAccessEnabled) {
      return;
    }

    const normalized = normalizeApiError(error);
    const { translatedMessage, errorCode, metadata } = normalized || {};

    const getValidationType = (element: { type?: string }): ValidationErrorType => {
      const elementType = element.type?.toLowerCase() ?? "";

      if (elementType.includes("min")) {
        return VALIDATION_ERROR_TYPES.MIN
      } else if (elementType.includes("max")) {
        return VALIDATION_ERROR_TYPES.MAX
      } else if (elementType.includes("required") || elementType.includes("empty")) {
        return VALIDATION_ERROR_TYPES.REQUIRED
      } else {
        return VALIDATION_ERROR_TYPES.OTHER
      }
    }

    if (
      errorCode === "VALIDATION_ERROR" &&
      Array.isArray(metadata?.errors) &&
      metadata.errors.length > 0
    ) {
      let finalError = [`${translatedMessage}`];
      const seen = new Set<string>();

      for (const element of metadata.errors) {
        let type: ValidationErrorType = getValidationType(element);
        const key = `${element.field}:${type}`;

        if (seen.has(key)) continue;
        seen.add(key);

        finalError.push(`${i18n?.t(`errors.${type}`, { field: element.field, fieldValue: fields[element.field] })}`);
      }

      showError(finalError);
      return;
    }

    showError(translatedMessage);
  }, [showError]);

  return { handleError };
};

export default useErrorHandler;
