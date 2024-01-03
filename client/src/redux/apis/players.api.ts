// Need to use the React-specific entry point to import createApi
import { PlayerInfo } from "@/types/player.types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const playersApi = createApi({
	reducerPath: "playersApi",
	baseQuery: fetchBaseQuery({
		baseUrl: `${import.meta.env.VITE_BASE_URL}/players`,
	}),
	endpoints: (builder) => ({
		searchPlayer: builder.query<string[], string>({
			query: (query) => ({
				url: `?q=${query}`,
				method: "Get",
				credentials: "include",
			}),
		}),
		getPlayerInfo: builder.query<PlayerInfo, string>({
			query: (username) => ({
				url: `/${username}`,
				method: "Get",
				credentials: "include",
			}),
		}),
	}),
});

export const { useSearchPlayerQuery, useGetPlayerInfoQuery } = playersApi;
