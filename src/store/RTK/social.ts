import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithReauth from '../AuthRTK/baseQueryWithReauth';

export const social = createApi({
    reducerPath: 'social',
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getNetworks: builder.query({
            query: () => ({
                url: `social/networks`,
                method: 'GET',
            }),
        }),
        getProviders: builder.query({
            query: ({ networkID }) => ({
                url: `social/networks?includeProviders=true&networkID=${networkID}`,
                method: 'GET',
            }),
        }),
        getConfigs: builder.query({
            query: ({ companyID, sn_providerID, botID }) => ({
                url: `company/config?companyID=${companyID}&sn_providerID=${sn_providerID}&botID=${botID}&ownerType=provider`,
            }),
        }),
        updateConfigs: builder.mutation({
            query: ({ companyID, sn_providerID, botID, key, data }) => ({
                url: `company/config?companyID=${companyID}&sn_providerID=${sn_providerID}&botID=${botID}`,
                method: 'PUT',
                body: {
                    key,
                    data
                }
            }),
        }),
    }),
});

export const {
    useGetNetworksQuery,
    useLazyGetProvidersQuery,
    useLazyGetConfigsQuery,
    useUpdateConfigsMutation
} = social;