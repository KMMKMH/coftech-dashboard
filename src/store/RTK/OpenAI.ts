import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithReauth from '../AuthRTK/baseQueryWithReauth';

export const openAIApi = createApi({
    reducerPath: 'openAIApi',
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getCosts: builder.mutation({
            query: ({ companyID, botID, start, end }) => ({
                url: `utils/openai/costs?companyID=${companyID}&botID=${botID}`,
                method: 'POST',
                body: {
                    "start_time": start,
                    "end_time": end
                },
            }),
        }),
    }),
});

export const {
    useGetCostsMutation,
} = openAIApi;