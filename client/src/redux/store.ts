import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { authApi } from "./apis/auth.api";
import { setupListeners } from "@reduxjs/toolkit/query";
import { PlayerReducer } from "./slices/player.slice";
import { playersApi } from "./apis/players.api";
import { friendsApi } from "./apis/friends.api";

export const store = configureStore({
	reducer: {
		[authApi.reducerPath]: authApi.reducer,
		[playersApi.reducerPath]: playersApi.reducer,
		[friendsApi.reducerPath]: friendsApi.reducer,
		Player: PlayerReducer,
	},

	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware()
			.concat(authApi.middleware)
			.concat(playersApi.middleware)
			.concat(friendsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useAppDispatch: () => AppDispatch = useDispatch;

setupListeners(store.dispatch);
