import { AxiosUrl } from "@component/configs/AxiosConfig";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const GetExtensionsData = createAsyncThunk(
  "get/extensionsData",
  async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const response: any = await AxiosUrl.get(`utils/extensions`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const GetExtensionsByBot = createAsyncThunk(
  "get/extensionsByBot",
  async (botId: string, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
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

export const DeleteExtensionsByBot = createAsyncThunk(
  "delete/extensionsByBot",
  async (args: { botId: string; extensionId: string }, thunkAPI) => {
    const { botId, extensionId } = args;
    const { rejectWithValue } = thunkAPI;
    try {
      const response: any = await AxiosUrl.delete(
        `bots/extensions?botID=${botId}&extensionID=${extensionId}`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const AssignExtensionsByBot = createAsyncThunk(
  "post/extensionsByBot",
  async (args: { botId: string; extensionId: string }, thunkAPI) => {
    const { botId, extensionId } = args;
    const { rejectWithValue } = thunkAPI;
    try {
      const response: any = await AxiosUrl.post(
        `bots/extensions?botID=${botId}&extensionID=${extensionId}`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

interface Pros {
  loading: boolean;
  allExtensions: any;
  extensionsByBot: any;
  error: {
    status?: number;
    message: string;
    isPinError?: boolean;
  };
}

const initialState: Pros = {
  loading: false,
  allExtensions: [],
  extensionsByBot: [],
  error: {
    status: 0,
    message: "",
    isPinError: false,
  },
};

const extensionsSlice = createSlice({
  name: "extensions",
  initialState,
  reducers: {
    ResetExtensions: (state) => {
      state.allExtensions = [];
      state.extensionsByBot = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(GetExtensionsData.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(GetExtensionsData.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.allExtensions = payload.data;
    });
    builder.addCase(GetExtensionsData.rejected, (state, action: any) => {
      state.loading = false;
      state.error = {
        message: action.payload?.message || action.payload || "An error occurred",
      };
    });

    builder.addCase(GetExtensionsByBot.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(GetExtensionsByBot.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.extensionsByBot = payload.data;
    });
    builder.addCase(GetExtensionsByBot.rejected, (state, action: any) => {
      state.loading = false;
      state.error = {
        message: action.payload?.message || action.payload || "An error occurred",
      };
    });
  },
});

export const { ResetExtensions } = extensionsSlice.actions;
export default extensionsSlice.reducer;
