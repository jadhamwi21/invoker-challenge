import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

type MatchState = {
	sessionID: string;
};

const initialState: MatchState = {
	sessionID: null,
};

const slice = createSlice({
	name: "match",
	initialState,
	reducers: {
		setSessionID: (state, { payload }: PayloadAction<string>) => {
			state.sessionID = payload;
		},
	},
});

export const MatchReducer = slice.reducer;
export const { setSessionID } = slice.actions;
export const selectMatch = (state: RootState) => state.Match;
