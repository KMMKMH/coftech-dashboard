import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithReauth from '../AuthRTK/baseQueryWithReauth';

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        login: builder.mutation({
            query: ({ email, password }) => ({
                url: `auth/login`,
                method: 'POST',
                body: {
                    email,
                    password,
                },
            }),
        }),
        register: builder.mutation({
            query: ({ companyID, data }) => ({
                url: `auth/register?companyID=${companyID}`,
                method: 'POST',
                body: {
                    ...data
                },
            }),
        }),
        deleteUser: builder.mutation({
            query: ({ companyID, userID }) => ({
                url: `accounts?companyID=${companyID}&userID=${userID}`,
                method: 'DELETE',
            }),
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useDeleteUserMutation
} = authApi;