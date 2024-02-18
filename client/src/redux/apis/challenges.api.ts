// Need to use the React-specific entry point to import createApi
import { NewChallengeRequest } from "@/types/challenges.types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const challengesApi = createApi({
	reducerPath: "challengesApi",
	baseQuery: fetchBaseQuery({
		baseUrl: `${import.meta.env.VITE_BASE_URL}/challenges`,
		credentials: "include",
	}),
	endpoints: (builder) => ({
		challenge: builder.mutation<void, NewChallengeRequest>({
			query: (args) => ({
				url: `/`,
				method: "POST",
				body: args,
			}),
		}),
		acceptChallenge: builder.mutation<void, string>({
			query: (id) => ({
				url: `/${id}/accept`,
				method: "DELETE",
			}),
		}),
		denyChallenge: builder.mutation<void, string>({
			query: (id) => ({
				url: `/${id}/deny`,
				method: "DELETE",
			}),
		}),
	}),
});

export const {
	useChallengeMutation,
	useAcceptChallengeMutation,
	useDenyChallengeMutation,
} = challengesApi;
