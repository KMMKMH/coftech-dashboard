import { combineReducers } from "@reduxjs/toolkit";
import usersSlice from "./usersSlice";
import botsSlice from "./botsSlice";
import companySlice from "./companySlice";
import settingSlice from "./settingSlice";
import integrationsSlice from "./integrationsSlice";
import { socketSlice } from "./Socket";
import { botsApi } from "./RTK/botsRTK";
import { fileManagerApi } from "./RTK/FileManager";
import extensionsSlice from "./extensionsSlice";
import deskSlice from "./deskSlice";
import { openAIApi } from "./RTK/OpenAI";
import filtersSlice from "./filtersSlice";
import { passwordRecovery } from "./RTK/PasswordRecovery";
import sidebarCollapseSlice from "./sidebarCollapseSlice";
import { activity } from "./RTK/activity";
import { promptBackups } from "./RTK/PromptsBackups";
import { social } from "./RTK/social";
import { promptsRTK } from "./RTK/promptsRTK";
import { authApi } from "./RTK/auth";

const rootReducer = combineReducers({
  socket: socketSlice,
  users: usersSlice,
  bots: botsSlice,
  company: companySlice,
  setting: settingSlice,
  integration: integrationsSlice,
  extensions: extensionsSlice,
  desk: deskSlice,
  filters: filtersSlice,
  sidebarCollapse: sidebarCollapseSlice,
  [botsApi.reducerPath]: botsApi.reducer,
  [fileManagerApi.reducerPath]: fileManagerApi.reducer,
  [openAIApi.reducerPath]: openAIApi.reducer,
  [passwordRecovery.reducerPath]: passwordRecovery.reducer,
  [activity.reducerPath]: activity.reducer,
  [promptBackups.reducerPath]: promptBackups.reducer,
  [social.reducerPath]: social.reducer,
  [promptsRTK.reducerPath]: promptsRTK.reducer,
  [authApi.reducerPath]: authApi.reducer
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
