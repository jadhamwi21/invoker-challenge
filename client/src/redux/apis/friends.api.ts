// Need to use the React-specific entry point to import createApi
import { PlayerInfo } from "@/types/player.types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const friendsApi = createApi({
	reducerPath: "friendsApi",
	baseQuery: fetchBaseQuery({
		baseUrl: `${import.meta.env.VITE_BASE_URL}/`,
	}),
	endpoints: (builder) => ({
		getClientFriends: builder.query<string[], void>({
			query: () => ({
				url: `friends`,
				method: "Get",
				credentials: "include",
			}),
		}),
	}),
});

export const { useGetClientFriendsQuery } = friendsApi;
