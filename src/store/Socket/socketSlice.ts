import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface SocketState {
  isConnected: boolean;
  rooms: string[];
  isQrExpired: boolean;
  action: {
    type: string;
    idBot: string;
    resolve: boolean;
  };
  qr: {
    qrCode: string;
    show: boolean;
    resolve: boolean;
  };
}

const initialState: SocketState = {
  isConnected: false,
  rooms: [],
  isQrExpired: false,
  action: {
    type: "",
    idBot: "",
    resolve: false,
  },
  qr: {
    qrCode: "",
    show: false,
    resolve: false,
  },
};

type RoomAction = PayloadAction<{
  room: string;
}>;

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    initSocket: (state) => {
      return;
    },
    connectionEstablished: (state) => {
      state.isConnected = true;
    },
    connectionLost: (state) => {
      state.isConnected = false;
    },
    joinRoom: (state, action: RoomAction) => {
      const room = action.payload.room;

      if (!state.rooms.includes(room)) {
        state.rooms.push(room);
      }
    },

    leaveRoom: (state, action: RoomAction) => {
      const roomToRemove = action.payload.room;

      state.rooms = state.rooms.filter((room) => room !== roomToRemove);
    },

    qrGenerated: (state, action: PayloadAction<{ qrCode: string }>) => {
      state.qr = { qrCode: action.payload.qrCode, show: true, resolve: false };
      return;
    },
    deviceReady: (state) => {
      state.qr = { qrCode: "", show: false, resolve: true };
      return;
    },
    resetQrGenerated: (state) => {
      state.qr = { qrCode: "", show: false, resolve: false };
      return;
    },
    loadBotAction: (
      state,
      action: PayloadAction<{ type: string; idBot: string }>
    ) => {
      state.action = {
        type: action.payload.type,
        idBot: action.payload.idBot,
        resolve: false,
      };
    },
    resetBotAction: (state) => {
      state.action = {
        type: "",
        idBot: "",
        resolve: false,
      };
    },
    canceledInitialization: (
      state,
      action: PayloadAction<{
        process: string;
        bot_id: string;
        extra: { suspended: boolean };
      }>
    ) => {
      const { process, bot_id, extra } = action.payload;
      if (
        process === state.action.type &&
        bot_id === state.action.idBot &&
        extra.suspended
      ) {
        state.action.resolve = true;
      }
      return;
    },
    botSuspended: (
      state,
      action: PayloadAction<{
        process: string;
        bot_id: string;
        extra: { suspended: boolean };
      }>
    ) => {
      const { process, bot_id } = action.payload;
      if (
        process === state.action.type &&
        bot_id === state.action.idBot
      ) {
        state.action.resolve = true;
      }
      return;
    },
    botActivated: (
      state,
      action: PayloadAction<{
        process: string;
        bot_id: string;
        extra: { activated: boolean };
      }>
    ) => {
      const { process, bot_id, extra } = action.payload;
      if (
        process === state.action.type &&
        bot_id === state.action.idBot &&
        extra.activated
      ) {
        state.action.resolve = true;
      }
      return;
    },
    botUnlinked: (
      state,
      action: PayloadAction<{
        process: string;
        bot_id: string;
        extra: { unlinked: boolean };
      }>
    ) => {
      const { process, bot_id, extra } = action.payload;
      if (
        process === state.action.type &&
        bot_id === state.action.idBot &&
        extra.unlinked
      ) {
        state.action.resolve = true;
      }
      return;
    },
    qrExpired: (state, action: PayloadAction<boolean>) => {
      const isExpired = action.payload;
      if (isExpired) {
        state.isQrExpired = true;
      }
      return;
    },
    resetQrExpired: (state) => {
      state.isQrExpired = false;
    }
  },
});

export const {
  initSocket,
  connectionEstablished,
  connectionLost,
  joinRoom,
  leaveRoom,
  qrGenerated,
  deviceReady,
  resetQrGenerated,
  loadBotAction,
  canceledInitialization,
  botSuspended,
  botActivated,
  botUnlinked,
  resetBotAction,
  qrExpired,
  resetQrExpired,
} = socketSlice.actions;

export default socketSlice.reducer;
