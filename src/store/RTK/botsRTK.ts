import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "../AuthRTK/baseQueryWithReauth";
import { i18n } from "next-i18next";

export const botsApi = createApi({
  reducerPath: "botsApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getBots: builder.query({
      query: () => ({
        url: "bots",
      })
    }),
    getBotByIdentifier: builder.query({
      query: (identifier) => ({
        url: `bots?identifier=${identifier}`,
      })
    }),
    getBotByCompany: builder.query({
      query: (company) => ({
        url: `bots?companyID=${company}`,
      })
    }),
    getNotAssignedExtensions: builder.query({
      query: (botID) => ({
        url: `bots/extensions?botID=${botID}&unassigned=${true}`,
      })
    }),
    getExtensions: builder.query({
      query: (botID) => ({
        url: `bots/extensions?botID=${botID}`,
      })
    }),
    getBotSummary: builder.query({
      query: ({ company, botId, type, from, to }) => ({
        url: `bots/summary?companyID=${company}&botID=${botId}&type=${type}&from=${from}&to=${to}`,
      })
    }),
    eventInitialize: builder.mutation({
      query: (uuid) => ({
        url: `bots/events/initialize?botID=${uuid}`,
        method: 'POST',
      }),
    }),
    eventCancelInitializition: builder.mutation({
      query: (uuid) => ({
        url: `/bots/events/cancelInitialization?botID=${uuid}`,
        method: 'POST',
      }),
    }),
    eventStart: builder.mutation({
      query: (uuid) => ({
        url: `bots/events/start?botID=${uuid}`,
        method: 'POST',
      }),
    }),

    eventSuspend: builder.query({
      query: (uuid) => ({
        url: `bots/events/stop?botID=${uuid}`,
      })
    }),
    eventRestart: builder.mutation({
      query: (uuid) => ({
        url: `bots/events/restart?botID=${uuid}`,
        method: 'POST',
      }),
    }),
    eventDelete: builder.query({
      query: (uuid) => ({
        url: `bots/events/delete?botID=${uuid}`,
      })
    }),
    createBot: builder.mutation({
      query: (data) => ({
        url: `bots`,
        method: "POST",
        body: data,
      }),
    }),
    updateBot: builder.mutation({
      query: ({ uuid, companyID, data }) => ({
        url: `bots?botID=${uuid}&companyID=${companyID}`,
        method: "PUT",
        body: data,
        headers: { "Content-Type": "application/json" }
      }),
    }),
    deleteBot: builder.mutation({
      query: (id) => ({
        url: `bots/events/delete?botID=${id}`,
        method: "GET",
      }),
    }),
    getSocialNetworkActivations: builder.query({
      query: (id) => ({
        url: `bots/social-network-activations?botID=${id}`
      })
    }),
    updateSocialNetworkActivations: builder.mutation({
      query: ({ id, networkID, providerID }) => ({
        url: `bots/social-network-activations?botID=${id}&networkID=${networkID}&providerID=${providerID}`,
        method: "PUT",
      })
    }),

    getBotConfigs: builder.query({
      query: (id) => ({
        url: `bots/configs?botID=${id}`
      })
    }),
    updateBotConfig: builder.mutation({
      query: ({ id, config, data }) => ({
        url: `bots/configs?botID=${id}&configID=${config}`,
        method: "PUT",
        body: {
          data
        }
      })
    }),
  }),
});

export const {
  useGetBotsQuery,
  useGetBotByIdentifierQuery,
  useGetBotByCompanyQuery,
  useLazyGetBotSummaryQuery,
  useLazyGetExtensionsQuery,
  useLazyGetNotAssignedExtensionsQuery,
  useEventInitializeMutation,
  useEventCancelInitializitionMutation,
  useEventStartMutation,
  useLazyEventSuspendQuery,
  useEventRestartMutation,
  useEventDeleteQuery,
  useLazyEventDeleteQuery,
  useGetSocialNetworkActivationsQuery,
  useLazyGetSocialNetworkActivationsQuery,
  useUpdateSocialNetworkActivationsMutation,
  useCreateBotMutation,
  useUpdateBotMutation,
  useDeleteBotMutation,
  useLazyGetBotConfigsQuery,
  useUpdateBotConfigMutation,
} = botsApi;
