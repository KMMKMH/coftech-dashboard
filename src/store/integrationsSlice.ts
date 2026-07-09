import { AxiosUrl } from "@component/configs/AxiosConfig";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export const GetBotExtension = createAsyncThunk(
  "get/botsExtension",
  async (botId: string, { rejectWithValue }) => {
    try {
      const response: any = await AxiosUrl.get(
        `bots/extensions?botID=${botId}`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const GetGoogleScopes = createAsyncThunk(
  "get/googleScopes",
  async (args: { serviceName: string }, thunkAPI) => {
    const { serviceName } = args;
    const { rejectWithValue } = thunkAPI;
    try {
      const response: any = await AxiosUrl.get(
        `google/scopes?serviceName=${serviceName}`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const GetGoogleAuth = createAsyncThunk(
  "get/googleAuth",
  async (args: { botId: string; googleScopeId: string }, thunkAPI) => {
    const { botId, googleScopeId } = args;
    const { rejectWithValue } = thunkAPI;
    try {
      const response: any = await AxiosUrl.get(
        `google/auth?botID=${botId}&googleScopeID=${googleScopeId}`
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const GetRevokeGoogle = createAsyncThunk(
  "get/revokeGoogle",
  async (args: { botId: string }, thunkAPI) => {
    const { botId } = args;
    const { rejectWithValue } = thunkAPI;
    try {
      const response: any = await AxiosUrl.get(
        `google/auth/revoke?botID=${botId}`
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

interface Error {
  status?: number;
  message: string;
  isPinError?: boolean;
}

interface GoogleAuthData {
  isConnectGoogleAuth: boolean;
  accessToken: string;
}

interface Pros {
  loading: boolean;
  botExtensions: any[];
  editExtension: any[];
  googleAuthData: GoogleAuthData;
  error: Error;
}

const initialState: Pros = {
  loading: false,
  botExtensions: [],
  editExtension: [],
  googleAuthData: {
    isConnectGoogleAuth: false,
    accessToken: "",
  },
  error: {
    status: 0,
    message: "",
    isPinError: false,
  },
};

const integrationsSlice = createSlice({
  name: "integration",
  initialState,
  reducers: {
    ResetIntegrations: (state) => {
      state.botExtensions = [];
      state.googleAuthData = {
        isConnectGoogleAuth: false,
        accessToken: "",
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(GetBotExtension.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(GetBotExtension.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.botExtensions = payload.data;
    });
    builder.addCase(GetBotExtension.rejected, (state, action: any) => {
      state.loading = false;
      state.error = {
        message: action.payload?.message || action.payload || "An error occurred",
      };
    });

    builder.addCase(GetGoogleAuth.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(GetGoogleAuth.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.googleAuthData = {
        isConnectGoogleAuth: payload.data.status,
        accessToken: payload.data.data,
      };
    });
    builder.addCase(GetGoogleAuth.rejected, (state, action: any) => {
      state.loading = false;
      state.error = {
        message: action.payload?.message || action.payload || "An error occurred",
      };
    });

    builder.addCase(GetRevokeGoogle.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(GetRevokeGoogle.fulfilled, (state, { payload }) => {
      state.loading = false;
      if (payload.data.code === 200) {
        state.googleAuthData = {
          isConnectGoogleAuth: false,
          accessToken: "",
        };
      }
    });
    builder.addCase(GetRevokeGoogle.rejected, (state, action: any) => {
      state.loading = false;
      state.error = {
        message: action.payload?.message || action.payload || "An error occurred",
      };
    });
  },
});

export default integrationsSlice.reducer;
