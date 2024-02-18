// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const matchmakeApi = createApi({
	reducerPath: "matchmakeApi",
	baseQuery: fetchBaseQuery({
		baseUrl: `${import.meta.env.VITE_BASE_URL}/matchmake`,
		credentials: "include",
	}),
	endpoints: (builder) => ({
		challengeFriend: builder.mutation({
			query: (username) => ({
				url: `/${username}`,
				method: "POST",
			}),
		}),
	}),
});

export const { useChallengeFriendMutation } = matchmakeApi;
