import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { authApi } from "./apis/auth.api";
import { friendsApi } from "./apis/friends.api";
import { matchmakeApi } from "./apis/matchmake.api";
import { notificationsApi } from "./apis/notifications.api";
import { playersApi } from "./apis/players.api";
import { PlayReducer } from "./slices/play.slice";
import { PlayerReducer } from "./slices/player.slice";

export const store = configureStore({
	reducer: {
		[authApi.reducerPath]: authApi.reducer,
		[playersApi.reducerPath]: playersApi.reducer,
		[friendsApi.reducerPath]: friendsApi.reducer,
		[notificationsApi.reducerPath]: notificationsApi.reducer,
		[matchmakeApi.reducerPath]: matchmakeApi.reducer,
		Player: PlayerReducer,
		Play: PlayReducer,
	},

	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware()
			.concat(authApi.middleware)
			.concat(playersApi.middleware)
			.concat(friendsApi.middleware)
			.concat(matchmakeApi.middleware)
			.concat(notificationsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useAppDispatch: () => AppDispatch = useDispatch;

setupListeners(store.dispatch);
