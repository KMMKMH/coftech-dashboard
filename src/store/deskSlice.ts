import { AxiosUrl } from "@component/configs/AxiosConfig";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Desk Base
export const GetDeskBase = createAsyncThunk(
  "get/deskBase",
  async (args: { companyId: string }, thunkAPI) => {
    const { companyId } = args;
    const { rejectWithValue } = thunkAPI;
    try {
      const response: any = await AxiosUrl.get(
        `desk/base?companyID=${companyId}`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const CreateDeskBase = createAsyncThunk(
  "post/deksBase",
  async (args: { companyId: string; baseName: string }, thunkAPI) => {
    const { companyId, baseName } = args;
    const { rejectWithValue } = thunkAPI;
    try {
      const response: any = await AxiosUrl.post(
        `desk/base?companyID=${companyId}`,
        {
          name: baseName,
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Desk Table
export const GetDeskTable = createAsyncThunk(
  "get/deskTable",
  async (args: { baseId: string }, thunkAPI) => {
    const { baseId } = args;
    const { rejectWithValue } = thunkAPI;
    try {
      const response: any = await AxiosUrl.get(`desk/table?baseID=${baseId}`,
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const GetDeskTableById = createAsyncThunk(
  "get/deskTableById",
  async (args: { baseId: string; tableId: string }, thunkAPI) => {
    const { baseId, tableId } = args;
    const { rejectWithValue } = thunkAPI;
    try {
      const response: any = await AxiosUrl.get(
        `desk/table?baseID=${baseId}&tableID=${tableId}`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const CreateDeskTable = createAsyncThunk(
  "post/deksTable",
  async (
    args: { baseId: string; tableName: string; columns: any[] },
    thunkAPI
  ) => {
    const { baseId, tableName, columns } = args;
    const { rejectWithValue } = thunkAPI;
    try {
      const response: any = await AxiosUrl.post(`desk/table?baseID=${baseId}`, {
        table_name: tableName,
        columns: columns,
      }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const RemoveDeskTable = createAsyncThunk(
  "delete/deskTable",
  async (
    args: {
      baseId: string;
      tableId: string;
    },
    thunkAPI
  ) => {
    const { baseId, tableId } = args;
    const { rejectWithValue } = thunkAPI;
    try {
      const response: any = await AxiosUrl.delete(
        `desk/table?baseID=${baseId}&tableID=${tableId}`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Desk Table/Column
export const GetDeskTableColumn = createAsyncThunk(
  "get/deskTableColumn",
  async (args: { tableId: string }, thunkAPI) => {
    const { tableId } = args;
    const { rejectWithValue } = thunkAPI;
    try {
      const response: any = await AxiosUrl.get(
        `desk/table/column?tableID=${tableId}`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const CreateDeskTableColumn = createAsyncThunk(
  "post/deskTableColumn",
  async (
    args: {
      tableId: string;
      newColumnName: string;
      newColumnType: string;
    },
    thunkAPI
  ) => {
    const { tableId, newColumnName, newColumnType } = args;
    const { rejectWithValue } = thunkAPI;
    try {
      const response: any = await AxiosUrl.post(
        `desk/table/column?tableID=${tableId}`,
        {
          name: newColumnName,
          type: newColumnType,
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const UpdateDeskTableColumn = createAsyncThunk(
  "put/deskTableColumn",
  async (
    args: {
      tableId: string;
      columnId: string;
      editColumnName: string;
      editColumnType: string;
    },
    thunkAPI
  ) => {
    const { tableId, columnId, editColumnName, editColumnType } = args;
    const { rejectWithValue } = thunkAPI;
    try {
      const response: any = await AxiosUrl.put(
        `desk/table/column?tableID=${tableId}&columnID=${columnId}`,
        {
          column_name: editColumnName,
          column_type: editColumnType,
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const RemoveDeskTableColumn = createAsyncThunk(
  "delete/deskTableColumn",
  async (
    args: {
      tableId: string;
      columnId: string;
    },
    thunkAPI
  ) => {
    const { tableId, columnId } = args;
    const { rejectWithValue } = thunkAPI;
    try {
      const response: any = await AxiosUrl.delete(
        `desk/table/column?tableID=${tableId}&columnID=${columnId}`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Desk Table/Data
export const CreateDeskTableData = createAsyncThunk(
  "post/deskTableData",
  async (
    args: {
      tableId: string;
      columnData: { columnID: string; data: string }[];
    },
    thunkAPI
  ) => {
    const { tableId, columnData } = args;
    const { rejectWithValue } = thunkAPI;
    try {
      const response: any = await AxiosUrl.post(
        `desk/table/data?tableID=${tableId}`,
        columnData
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const GetDeskTableData = createAsyncThunk(
  "get/deskTableData",
  async (args: { tableId: string }, thunkAPI) => {
    const { tableId } = args;
    const { rejectWithValue } = thunkAPI;
    try {
      const response: any = await AxiosUrl.get(
        `desk/table/data?tableID=${tableId}`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

interface Pros {
  loading: boolean;
  base: any;
  table: any;
  columns: any;
  data: any;
  error: {
    status?: number;
    message: string;
    isPinError?: boolean;
  };
}

const initialState: Pros = {
  loading: false,
  base: [],
  table: [],
  columns: [],
  data: [],
  error: {
    status: 0,
    message: "",
    isPinError: false,
  },
};

const deskSlice = createSlice({
  name: "desk",
  initialState,
  reducers: {
    ResetDesk: (state) => {
      state.base = [];
      state.table = [];
      state.columns = [];
      state.data = [];
    },
  },
  extraReducers: (builder) => {
    // Base
    builder.addCase(GetDeskBase.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(GetDeskBase.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.base = {
        uuid_unique: payload?.data?.[0]?.uuid_unique,
        baseName: payload?.data?.[0]?.name,
      };
    });
    builder.addCase(GetDeskBase.rejected, (state, action: any) => {
      state.loading = false;
      state.error = {
        message: action.payload?.message || action.payload || "An error occurred",
      };
    });

    // Table
    builder.addCase(GetDeskTable.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(GetDeskTable.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.table = payload.data;
    });
    builder.addCase(GetDeskTable.rejected, (state, action: any) => {
      state.loading = false;
      state.error = {
        message: action.payload?.message || action.payload || "An error occurred",
      };
    });

    // Columns
    builder.addCase(GetDeskTableColumn.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(GetDeskTableColumn.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.columns = payload.data;
    });
    builder.addCase(GetDeskTableColumn.rejected, (state, action: any) => {
      state.loading = false;
      state.error = {
        message: action.payload?.message || action.payload || "An error occurred",
      };
    });

    // Data
    builder.addCase(GetDeskTableData.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(GetDeskTableData.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.data = payload.data;
    });
    builder.addCase(GetDeskTableData.rejected, (state, action: any) => {
      state.loading = false;
      state.error = {
        message: action.payload?.message || action.payload || "An error occurred",
      };
    });
  },
});

export const { ResetDesk } = deskSlice.actions;
export default deskSlice.reducer;
