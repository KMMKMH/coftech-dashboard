import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "../AuthRTK/baseQueryWithReauth";
import { i18n } from "next-i18next";

export const activity = createApi({
  reducerPath: "activity",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getActivity: builder.query({
      query: ({ companyID, botID, action_type, resource_type, startDate, endDate, page }) => {
        let query = `dashboardLogs?companyID=${companyID}&page=${page}`

        if (botID != undefined) {
          query += `&botID=${botID}`
        }
        if (action_type != undefined) {
          query += `&action_type=${action_type}`
        }
        if (resource_type != undefined) {
          query += `&resource_type=${resource_type}`
        }
        if (startDate != undefined) {
          query += `&startDate=${startDate}&endDate=${endDate}`
        }

        return ({
          url: query,
        })
      },
    }),
    getActions: builder.query({
      query: () => ({
        url: `utils/action/types?languageCode=${i18n.t("prompt.lang")}`,
      })
    }),
    getResources: builder.query({
      query: () => ({
        url: `utils/resource/types?languageCode=${i18n.t("prompt.lang")}`,
      })
    }),
  }),
});

export const {
  useLazyGetActivityQuery,
  useLazyGetActionsQuery,
  useLazyGetResourcesQuery
} = activity;