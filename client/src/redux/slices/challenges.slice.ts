import { Challenge } from "@/types/challenges.types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { challengesApi } from "../apis/challenges.api";
import { RootState } from "../store";

type ChallengesState = {
	friend: string;
	duration: string;
	pendingChallengeId: string;
	challenges: Challenge[];
};

const initialState: ChallengesState = {
	friend: "",
	duration: "1",
	pendingChallengeId: null,
	challenges: [],
};

const slice = createSlice({
	name: "challenges",
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
		setPendingChallengeId: (state, { payload: id, type }: PayloadAction<string>) => {
			console.log(type);

			state.pendingChallengeId = id;
		},
		pushNewChallenge: (
			state,
			{ payload: challenge }: PayloadAction<Challenge>
		) => {
			state.challenges.push(challenge);
		},
		popChallenge: (state) => {
			state.challenges.shift();
		},
		removeChallengeById: (state, { payload }: PayloadAction<string>) => {
			state.challenges = state.challenges.filter(
				(challenge) => challenge.id === payload
			);
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
		builder.addMatcher(
			challengesApi.endpoints.cancelChallenge.matchFulfilled,
			(state) => {
				state.pendingChallengeId = null;
			}
		);
	},
});

export const ChallengeReducer = slice.reducer;
export const {
	setChallengeFriend,
	setChallengeDuration,
	pushNewChallenge,
	popChallenge,
	clearChallengers,
	setPendingChallengeId,
	removeChallengeById,
} = slice.actions;

export const selectChallenge = (state: RootState) => state.Challenge;
