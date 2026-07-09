import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "../AuthRTK/baseQueryWithReauth";

export const promptsRTK = createApi({
    reducerPath: "promptsRTK",
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getPrompts: builder.query({
            query: ({ companyID, botID }) => ({
                url: `prompts?companyID=${companyID}&botID=${botID}`,
            })
        }),
        savePrompt: builder.mutation({
            query: ({ companyID, botID, promptID, data }) => ({
                url: `prompts?companyID=${companyID}&botID=${botID}&promptID=${promptID}`,
                method: 'PUT',
                body: data,
            }),
        }),
        setPromptStatus: builder.mutation({
            query: ({ companyID, botID, promptID, status }) => ({
                url: `prompts?companyID=${companyID}&botID=${botID}&promptID=${promptID}`,
                method: 'PUT',
                body: {
                    status
                },
            }),
        }),
        createPrompt: builder.mutation({
            query: ({ companyID, botID, data }) => ({
                url: `prompts?companyID=${companyID}&botID=${botID}`,
                method: 'POST',
                body: data,
            }),
        }),
        testPrompt: builder.mutation({
            query: ({ botID, data }) => ({
                url: `prompts/test?botID=${botID}`,
                method: 'POST',
                body: data,
            }),
        }),
        promptAssist: builder.mutation({
            query: ({ companyID, botID, data }) => ({
                url: `prompts/assistance?companyID=${companyID}&botID=${botID}`,
                method: 'POST',
                body: data,
            }),
        }),
        deletePrompt: builder.mutation({
            query: ({ companyID, promptID, botID }) => ({
                url: `prompts?companyID=${companyID}&promptID=${promptID}&botID=${botID}`,
                method: 'DELETE',
            }),
        }),
    }),
});

export const {
    useLazyGetPromptsQuery,
    useCreatePromptMutation,
    useSavePromptMutation,
    useDeletePromptMutation,
    useSetPromptStatusMutation,
    useTestPromptMutation,
    usePromptAssistMutation
} = promptsRTK;