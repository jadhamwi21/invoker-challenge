import { PlayerDetails } from "@/types/player.types";
import { createSlice } from "@reduxjs/toolkit";
import { authApi } from "../apis/auth.api";
import { RootState } from "../store";

type PlayerState = {
	details: PlayerDetails | null;
};

const initialState: PlayerState = {
	details: null,
};

const slice = createSlice({
	name: "auth",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addMatcher(
			authApi.endpoints.loginPlayer.matchFulfilled,
			(state, { payload }) => {
				state.details = payload;
			}
		);
	},
});

export const PlayerReducer = slice.reducer;

export const selectPlayer = (state: RootState) => state.Player;
