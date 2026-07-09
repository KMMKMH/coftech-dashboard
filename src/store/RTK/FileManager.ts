import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithReauth from '../AuthRTK/baseQueryWithReauth';
import { i18n } from 'next-i18next';

export const fileManagerApi = createApi({
    reducerPath: 'fileManagerApi',
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getFiles: builder.query({
            query: ({ companyID, source = "filemanager" }) => ({
                url: `filemanager?companyID=${companyID}&source=${source}`,
            })
        }),
        getFileTypes: builder.query({
            query: (params?: { ragCompatible?: boolean }) => ({
                url: `filemanager/filetypes`,
                params: {
                    ...(params?.ragCompatible && { ragCompatible: true })
                }
            })
        }),
        getFileByCompany: builder.query({
            query: ({ companyID, source, botID, status, extensions }) => {
                if (status == 1) {
                    return ({
                        url: `filemanager?companyID=${companyID}&source=${source}${source == "filemanager" ? `` : `&botID=${botID}`}${extensions?.length > 0 ? `&extensions=${extensions}` : ``}`,
                    })
                } else {
                    return ({
                        url: `pinecone/disabled-documents?companyID=${companyID}&botID=${botID}`,
                    })
                }
            },
        }),
        getFileData: builder.query({
            query: ({ companyID, fileID }) => {
                return ({
                    url: `filemanager/presigned-url?companyID=${companyID}&fileID=${fileID}`,
                })
            },
        }),
        createFile: builder.mutation({
            query: ({ companyID, file, fileName, source, botID, presignedURL, description }) => {
                if (presignedURL) {
                    return ({
                        url: presignedURL,
                        method: 'PUT',
                        body: file,
                        headers: {
                            'Content-Type': file.type || 'application/octet-stream',
                        },
                    })
                } else {
                    return ({
                        url: `filemanager/presigned-url?companyID=${companyID}&filePath=${fileName}&source=${source}${source == "filemanager" ? `` : `&botID=${botID}`}&fileSize=${file.size}`,
                        method: 'PUT',
                        body: description ? { description } : {},
                    })
                }
            },
        }),
        updateFile: builder.mutation({
            query: ({ companyID, fileID, name, description }) => ({
                url: `filemanager?companyID=${companyID}&fileID=${fileID}`,
                method: 'PUT',
                body: description ? { name, description } : { name },
            }),
        }),
        deleteFile: builder.mutation({
            query: ({ companyID, fileID }) => ({
                url: `filemanager?companyID=${companyID}&fileID=${fileID}`,
                method: 'DELETE',
            }),
        }),
        set_removeFileDisabled: builder.mutation({
            query: ({ companyID, botID, fileID, status }) => {
                if (status == 1) {
                    return ({
                        url: `pinecone/disabled-documents?companyID=${companyID}&botID=${botID}&fileID=${fileID}`,
                        method: 'POST',
                    })
                } else {
                    return ({
                        url: `pinecone/disabled-documents?companyID=${companyID}&botID=${botID}&disabledFileID=${fileID}`,
                        method: 'DELETE',
                    })
                }
            }
        }),
    }),
});

export const {
    useGetFilesQuery,
    useGetFileTypesQuery,
    useLazyGetFileByCompanyQuery,
    useUpdateFileMutation,
    useDeleteFileMutation,
    useCreateFileMutation,
    useSet_removeFileDisabledMutation,
    useLazyGetFileDataQuery
} = fileManagerApi;
