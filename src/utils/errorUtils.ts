import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";


export function isFetchBaseError( error: unknown ): error is FetchBaseQueryError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error
  );
}

export function getErrorMessage(error: FetchBaseQueryError | SerializedError): string {
  if ("status" in error) {
    if (typeof error.data === "string") return error.data;
    if (error.data && typeof (error.data as any).message === "string")
      return (error.data as any).message;
    return "Unknown fetch error";
  } else {
    return error.message ?? "Unknown serialized error";
  }
}