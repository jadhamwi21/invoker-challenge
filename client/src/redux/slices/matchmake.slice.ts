import { MatchMakeFriendType } from "@/types/play.types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { matchmakeApi } from "../apis/matchmake.api";
import { RootState } from "../store";

type MatchMakeState = {
	friend: MatchMakeFriendType;
	duration: string;
	pendingAccept: boolean;
};

const initialState: MatchMakeState = {
	friend: "",
	duration: "1",
	pendingAccept: false,
};

const slice = createSlice({
	name: "play",
	initialState,
	reducers: {
		setMatchMakeFriend: (
			state,
			{ payload: friend }: PayloadAction<MatchMakeFriendType>
		) => {
			state.friend = friend;
		},
		setMatchMakeDuration: (
			state,
			{ payload: duration }: PayloadAction<string>
		) => {
			state.duration = duration;
		},
	},
	extraReducers(builder) {
		builder.addMatcher(
			matchmakeApi.endpoints.challengeFriend.matchFulfilled,
			(state) => {
				state.pendingAccept = true;
			}
		);
	},
});

export const MatchMakeReducer = slice.reducer;
export const { setMatchMakeFriend, setMatchMakeDuration } = slice.actions;

export const selectMatchMake = (state: RootState) => state.MatchMake;
