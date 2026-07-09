import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import { botsApi } from "./RTK/botsRTK";
import { fileManagerApi } from "./RTK/FileManager";
import { openAIApi } from "./RTK/OpenAI";
import { passwordRecovery } from "./RTK/PasswordRecovery";
import { activity } from "./RTK/activity";
import { promptBackups } from "./RTK/PromptsBackups";
import { social } from "./RTK/social";
import { promptsRTK } from "./RTK/promptsRTK";
import { authApi } from "./RTK/auth";

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            immutableCheck: false,
            serializableCheck: false,
        }).concat([
            botsApi.middleware,
            fileManagerApi.middleware,
            openAIApi.middleware,
            passwordRecovery.middleware,
            promptBackups.middleware,
            activity.middleware,
            social.middleware,
            promptsRTK.middleware,
            authApi.middleware
        ]),
});

export type AppDispatch = typeof store.dispatch;