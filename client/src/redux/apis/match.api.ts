// Need to use the React-specific entry point to import createApi
import { NewMatchRequest } from "@/types/match.types";
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
	}),
});

export const { useNewMatchMutation } = matchApi;
