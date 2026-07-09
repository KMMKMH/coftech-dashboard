import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithReauth from '../AuthRTK/baseQueryWithReauth';
import { i18n } from 'next-i18next';

export const promptBackups = createApi({
    reducerPath: 'promptBackups',
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getBackups: builder.query({
            query: ({ companyID, botID }) => ({
                url: `prompts/backups?companyID=${companyID}&botID=${botID}`,
            })
        }),
    }),
});

export const {
    useLazyGetBackupsQuery,
} = promptBackups;