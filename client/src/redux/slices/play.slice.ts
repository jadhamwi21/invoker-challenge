import { MatchConfigurationType, PlayFriendType } from "@/types/play.types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

type PlayState = {
	friend: PlayFriendType;
	configuration: MatchConfigurationType;
};

const initialState: PlayState = {
	friend: null,
	configuration: { duration: 60 },
};

const slice = createSlice({
	name: "play",
	initialState,
	reducers: {
		setPlayFriend: (
			state,
			{ payload: friend }: PayloadAction<PlayFriendType>
		) => {
			console.log(friend);

			state.friend = friend;
		},
	},
});

export const PlayReducer = slice.reducer;
export const { setPlayFriend } = slice.actions;

export const selectPlay = (state: RootState) => state.Play;
