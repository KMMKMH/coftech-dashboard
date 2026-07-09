import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "../AuthRTK/baseQueryWithReauth";
import { i18n } from "next-i18next";

export const passwordRecovery = createApi({
  reducerPath: "passwordRecovery",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    recoveryType: builder.mutation({
      query: ({ value, type }) => ({
        url: `auth/recovery/password`,
        method: 'POST',
        body: {
          "value": value,
          "type": type
        },
      }),
    }),
    verifyCode: builder.mutation({
      query: ({ value, type, code }) => ({
        url: `auth/verify/code`,
        method: 'POST',
        body: {
          "type": type,
          "code": code,
          "value": value
        },
      }),
    }),
    savePassword: builder.mutation({
      query: ({ password, jwt }) => ({
        url: `auth/save/password`,
        method: 'PUT',
        body: {
          "password": password
        },
        headers: {
          "authorization": `Bearer ${jwt}`,
        },
      }),
    }),
  }),
});

export const {
  useRecoveryTypeMutation,
  useSavePasswordMutation,
  useVerifyCodeMutation
} = passwordRecovery;