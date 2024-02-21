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
	name: "match",
	initialState,
	reducers: {
		setMatchConnectionStatus: (
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

export const MatchReducer = slice.reducer;
export const { setMatchConnectionStatus, setSessionID } = slice.actions;
export const selectMatch = (state: RootState) => state.Match;
