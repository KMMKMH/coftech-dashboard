import { AxiosUrl } from "@component/configs/AxiosConfig";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const companiesGet = createAsyncThunk(
    "get/companies",
    async (_, { rejectWithValue }) => {
        try {
            const response: any = await AxiosUrl.get(`company`);
            //@ts-ignore
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const GetCompanyById = createAsyncThunk(
    "get/CompanyById",
    async (companyId: string, { rejectWithValue }) => {
        try {
            const response: any = await AxiosUrl.get(`company?companyID=${companyId}`);
            //@ts-ignore
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

interface Pros {
    loading: boolean;
    companies: any;
    error: {
        status?: number;
        message: string;
        isPinError?: boolean;
    };
}

const initialState: Pros = {
    loading: false,
    companies: [],
    error: {
        status: 0,
        message: "",
        isPinError: false,
    },
};

const companySlice = createSlice({
    name: "company",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(companiesGet.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(companiesGet.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.companies = payload.data;
        });
        builder.addCase(companiesGet.rejected, (state, action: any) => {
            state.loading = false;
            state.error = {
                message: action.payload?.message || action.payload || "An error occurred",
            };
        });
        builder.addCase(GetCompanyById.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(GetCompanyById.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.companies = payload.data;
        });
        builder.addCase(GetCompanyById.rejected, (state, action: any) => {
            state.loading = false;
            state.error = {
                message: action.payload?.message || action.payload || "An error occurred",
            };
        });
    },
});

export default companySlice.reducer;
