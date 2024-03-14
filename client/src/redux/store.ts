import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistCombineReducers, persistStore } from "redux-persist";
import storage from 'redux-persist/lib/storage'; // def
import { authApi } from "./apis/auth.api";
import { challengesApi } from "./apis/challenges.api";
import { friendsApi } from "./apis/friends.api";
import { matchApi } from "./apis/match.api";
import { notificationsApi } from "./apis/notifications.api";
import { playersApi } from "./apis/players.api";
import { ChallengeReducer } from "./slices/challenges.slice";
import { MatchReducer } from "./slices/match.slice";
import { PlayerReducer } from "./slices/player.slice";

const reducers = persistCombineReducers({
	key: 'root',
	version: 1,
	storage,
	blacklist: [challengesApi.reducerPath, matchApi.reducerPath, "Challenge", "Match", friendsApi.reducerPath]
}, {
	[authApi.reducerPath]: authApi.reducer,
	[playersApi.reducerPath]: playersApi.reducer,
	[friendsApi.reducerPath]: friendsApi.reducer,
	[notificationsApi.reducerPath]: notificationsApi.reducer,
	[challengesApi.reducerPath]: challengesApi.reducer,
	[matchApi.reducerPath]: matchApi.reducer,
	Player: PlayerReducer,
	Challenge: ChallengeReducer,
	Match: MatchReducer,
})

const reduxPersistActions = [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER];

export const store = configureStore({
	reducer: reducers,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [...reduxPersistActions],
			}
		})
			.concat(authApi.middleware)
			.concat(playersApi.middleware)
			.concat(friendsApi.middleware)
			.concat(challengesApi.middleware)
			.concat(matchApi.middleware)
			.concat(notificationsApi.middleware),
});

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useAppDispatch: () => AppDispatch = useDispatch;

setupListeners(store.dispatch);
