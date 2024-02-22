import { EnMatchConnectionStatus } from "@/types/game.types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

type MatchState = {
	connectionStatus: EnMatchConnectionStatus;
	sessionID: string;
};

const initialState: MatchState = {
	connectionStatus: EnMatchConnectionStatus.None,
	sessionID: null,
};

const slice = createSlice({
	name: "game",
	initialState,
	reducers: {
		setGameConnectionStatus: (
			state,
			{ payload }: PayloadAction<EnMatchConnectionStatus>
		) => {
			state.connectionStatus = payload;
		},
		setSessionID: (state, { payload }: PayloadAction<string>) => {
			state.sessionID = payload;
		},
	},
});

export const GameReducer = slice.reducer;
export const { setGameConnectionStatus, setSessionID } = slice.actions;
export const selectGame = (state: RootState) => state.Game;
