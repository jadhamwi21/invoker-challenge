import { Challenge } from "@/types/challenges.types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { challengesApi } from "../apis/challenges.api";
import { RootState } from "../store";

type MatchMakeState = {
	friend: string;
	duration: string;
	pendingChallengeId: string;
	challenges: Challenge[];
};

const initialState: MatchMakeState = {
	friend: "",
	duration: "1",
	pendingChallengeId: null,
	challenges: [],
};

const slice = createSlice({
	name: "play",
	initialState,
	reducers: {
		setChallengeFriend: (state, { payload: friend }: PayloadAction<string>) => {
			state.friend = friend;
		},
		setChallengeDuration: (
			state,
			{ payload: duration }: PayloadAction<string>
		) => {
			state.duration = duration;
		},
		setPendingChallengeId: (state, { payload: id }: PayloadAction<string>) => {
			state.pendingChallengeId = id;
		},
		pushNewChallenge: (
			state,
			{ payload: challenge }: PayloadAction<Challenge>
		) => {
			state.challenges.push(challenge);
		},
		popChallenger: (state) => {
			state.challenges.shift();
		},
		clearChallengers: (state) => {
			state.challenges = [];
			state.pendingChallengeId = null;
		},
	},
	extraReducers(builder) {
		builder.addMatcher(
			challengesApi.endpoints.acceptChallenge.matchFulfilled,
			(state) => {
				state.challenges = [];
				state.pendingChallengeId = null;
			}
		);
		builder.addMatcher(
			challengesApi.endpoints.denyChallenge.matchFulfilled,
			(state) => {
				state.challenges.shift();
			}
		);
	},
});

export const ChallengeReducer = slice.reducer;
export const {
	setChallengeFriend,
	setChallengeDuration,
	pushNewChallenge,
	popChallenger,
	clearChallengers,
	setPendingChallengeId,
} = slice.actions;

export const selectChallenge = (state: RootState) => state.Challenge;
