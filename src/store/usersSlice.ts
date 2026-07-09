import { AxiosUrl } from "@component/configs/AxiosConfig";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const rolesGet = createAsyncThunk(
  "get/roles",
  async (_, { rejectWithValue }) => {
    try {
      const response: any = await AxiosUrl.get(`roles`
      );
      //@ts-ignore
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const accountsGet = createAsyncThunk(
  "get/accounts",
  async (companyId: string | undefined, { rejectWithValue }) => {
    try {
      const response: any = await AxiosUrl.get(
        `accounts?companyID=${companyId}`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const accountGetById = createAsyncThunk(
  "users/getAccountById",
  async ({ companyId, userId }: { companyId: string, userId: string }, { rejectWithValue }) => {
    try {
      const response = await AxiosUrl.get(`accounts?companyID=${companyId}&userID=${userId}`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

interface Pros {
  loading: boolean;
  roles?: any;
  accounts?: any;
  account: any | null;
  error: {
    status?: number;
    message: string;
    isPinError?: boolean;
  };
}

const initialState: Pros = {
  loading: false,
  roles: [],
  accounts: [],
  account: null,
  error: {
    status: 0,
    message: "",
    isPinError: false,
  },
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(rolesGet.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(rolesGet.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.roles = payload.data;
    });
    builder.addCase(rolesGet.rejected, (state, action: any) => {
      state.loading = false;

      state.error = {
        message: action.payload?.message || action.payload || "An error occurred",
      };
    });
    builder.addCase(accountsGet.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(accountsGet.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.accounts = payload.data;
    });
    builder.addCase(accountsGet.rejected, (state, action: any) => {
      state.loading = false;

      state.error = {
        message: action.payload?.message || action.payload || "An error occurred",
      };
    });
    builder.addCase(accountGetById.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(accountGetById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.account = payload.data[0];
    });
    builder.addCase(accountGetById.rejected, (state, action: any) => {
      state.loading = false;

      state.error = {
        message: action.payload?.message || action.payload || "An error occurred",
      };
    });
  },
});

export default usersSlice.reducer;
