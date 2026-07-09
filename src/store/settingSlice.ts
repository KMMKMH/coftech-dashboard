import { AxiosUrl } from "@component/configs/AxiosConfig";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const companyGlobalConfGet = createAsyncThunk(
  "get/company",
  async (
    { companyId, ownerType }: { companyId: string | undefined; ownerType: string },
    { rejectWithValue }
  ) => {
    try {
      const response: any = await AxiosUrl.get(
        `company/config?companyID=${companyId}&ownerType=${ownerType}`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const companyConfigExtensionGet = createAsyncThunk(
  "get/company/global",
  async (companyId: string | undefined, { rejectWithValue }) => {
    try {
      const response: any = await AxiosUrl.get(
        `company/config?companyID=${companyId}&ownerType=extension`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const companyUpdate = createAsyncThunk(
  "update/company",
  async (
    { companyId, data }: { companyId: string; data: any },
    { rejectWithValue }
  ) => {
    try {
      const response: any = await AxiosUrl.put(
        `company/config?companyID=${companyId}`,
        data
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

interface Pros {
  loading: boolean;
  companyConfig?: any;
  companyConfigGlobal?: any;
  error: {
    status?: number;
    message: string;
    isPinError?: boolean;
  };
}

const initialState: Pros = {
  loading: false,
  companyConfig: [],
  companyConfigGlobal: [],
  error: {
    status: 0,
    message: "",
    isPinError: false,
  },
};

const settingSlice = createSlice({
  name: "setting",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(companyGlobalConfGet.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(companyGlobalConfGet.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.companyConfig = payload.data;
    });
    builder.addCase(companyGlobalConfGet.rejected, (state, action: any) => {
      state.loading = false;

      state.error = {
        message: action.payload?.message || action.payload || "An error occurred",
      };
    });
    builder.addCase(companyUpdate.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(companyUpdate.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.companyConfig = state.companyConfig.map((company) =>
        company.uuid_unique === payload.uuid_unique ? payload : company
      );
    });
    builder.addCase(companyUpdate.rejected, (state, action: any) => {
      state.loading = false;
      state.error = {
        message: action.payload?.message || action.payload || "An error occurred",
      };
    });
    builder.addCase(companyConfigExtensionGet.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      companyConfigExtensionGet.fulfilled,
      (state, { payload }) => {
        state.loading = false;
        state.companyConfigGlobal = payload.data;
      }
    );
    builder.addCase(
      companyConfigExtensionGet.rejected,
      (state, action: any) => {
        state.loading = false;

        state.error = {
          message: action.payload?.message || action.payload || "An error occurred",
        };
      }
    );
  },
});

export default settingSlice.reducer;
