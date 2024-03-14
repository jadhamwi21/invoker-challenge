// Need to use the React-specific entry point to import createApi
import { MatchType, NewMatchRequest } from "@/types/match.types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const matchApi = createApi({
	reducerPath: "matchApi",
	baseQuery: fetchBaseQuery({
		baseUrl: `${import.meta.env.VITE_BASE_URL}/matches`,
		credentials: "include",
	}),
	endpoints: (builder) => ({
		newMatch: builder.mutation<void, NewMatchRequest>({
			query: (formData) => ({
				url: "/",
				method: "POST",
				body: formData,
			}),
		}),
		getMatch: builder.query<MatchType, string>({ query: (arg) => ({ url: `/${arg}`, method: "Get" }) })
	}),
});

export const { useNewMatchMutation, useLazyGetMatchQuery, useGetMatchQuery } = matchApi;
