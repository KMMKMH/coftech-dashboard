import { AxiosUrl } from "@component/configs/AxiosConfig";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const GetAllBots = createAsyncThunk(
  "get/allBots",
  async (_, { rejectWithValue }) => {
    try {
      const response: any = await AxiosUrl.get(`bots`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const GetBotByIdentifier = createAsyncThunk(
  "get/byIdentifier",
  async (identifier, { rejectWithValue }) => {
    try {
      const response: any = await AxiosUrl.get(`bots?identifier=${identifier}`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const GetBotsByCompany = createAsyncThunk(
  "get/botsByCompany",
  async (companyId: string, { rejectWithValue }) => {
    try {
      const response: any = await AxiosUrl.get(`bots?companyID=${companyId}`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

interface Pros {
  loading: boolean;
  bots: any;
  editBot: any;
  error: {
    status?: number;
    message: string;
    isPinError?: boolean;
  };
}

const initialState: Pros = {
  loading: false,
  bots: [],
  editBot: [],
  error: {
    status: 0,
    message: "",
    isPinError: false,
  },
};

const botsSlice = createSlice({
  name: "bots",
  initialState,
  reducers: {
    ResetBots: (state) => {
      state.bots = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(GetBotsByCompany.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(GetBotsByCompany.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.bots = payload.data;
    });
    builder.addCase(GetBotsByCompany.rejected, (state, action: any) => {
      state.loading = false;
      state.error = {
        message: action.payload?.message || action.payload || "An error occurred",
      };
    });
    builder.addCase(GetAllBots.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(GetAllBots.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.bots = payload.data;
    });
    builder.addCase(GetAllBots.rejected, (state, action: any) => {
      state.loading = false;
      state.error = {
        message: action.payload?.message || action.payload || "An error occurred",
      };
    });
    builder.addCase(GetBotByIdentifier.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(GetBotByIdentifier.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.editBot = payload.data;
    });
    builder.addCase(GetBotByIdentifier.rejected, (state, action: any) => {
      state.loading = false;
      state.error = {
        message: action.payload?.message || action.payload || "An error occurred",
      };
    });
  },
});

export const { ResetBots } = botsSlice.actions;
export default botsSlice.reducer;
