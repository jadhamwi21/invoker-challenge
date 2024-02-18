import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { authApi } from "./apis/auth.api";
import { challengesApi } from "./apis/challenges.api";
import { friendsApi } from "./apis/friends.api";
import { notificationsApi } from "./apis/notifications.api";
import { playersApi } from "./apis/players.api";
import { ChallengeReducer } from "./slices/challenges.slice";
import { PlayerReducer } from "./slices/player.slice";

export const store = configureStore({
	reducer: {
		[authApi.reducerPath]: authApi.reducer,
		[playersApi.reducerPath]: playersApi.reducer,
		[friendsApi.reducerPath]: friendsApi.reducer,
		[notificationsApi.reducerPath]: notificationsApi.reducer,
		[challengesApi.reducerPath]: challengesApi.reducer,
		Player: PlayerReducer,
		Challenge: ChallengeReducer,
	},

	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware()
			.concat(authApi.middleware)
			.concat(playersApi.middleware)
			.concat(friendsApi.middleware)
			.concat(challengesApi.middleware)
			.concat(notificationsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useAppDispatch: () => AppDispatch = useDispatch;

setupListeners(store.dispatch);
