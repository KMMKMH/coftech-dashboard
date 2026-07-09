import {
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { useAuthStore } from "../auth";
import { isTemporaryAccessEnabled } from "@component/utils/temporaryAccess";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_ENDPOINT_URL,
  prepareHeaders: (headers) => {
    const token = useAuthStore.getState().token;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && isTemporaryAccessEnabled) {
    return { data: undefined };
  }

  if (
    result.error &&
    result.error.status === 401 &&
    !isTemporaryAccessEnabled &&
    typeof window !== "undefined" &&
    window.location.pathname !== "/auth/login"
  ) {
    window.location.href = "/auth/login";
  }

  let error: any = result.error ? result.error : undefined;

  if (process.env.NODE_ENV === "development" && error?.errorCode) {
    console.groupCollapsed(`[API ERROR] ${error.errorCode}`);
    console.log("API raw error:");
    console.log(error);
    console.groupEnd();
  }

  return { ...result, error };
};

export default baseQueryWithReauth;
