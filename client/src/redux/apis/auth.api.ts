// Need to use the React-specific entry point to import createApi
import { PlayerCredentials, PlayerDetails } from "@/types/player.types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
	reducerPath: "authApi",
	baseQuery: fetchBaseQuery({
		baseUrl: `${import.meta.env.VITE_BASE_URL}/auth/`,
		credentials: "include",
	}),
	endpoints: (builder) => ({
		loginPlayer: builder.mutation<PlayerDetails, PlayerCredentials>({
			query: (formData) => ({
				url: "login",
				method: "POST",
				body: formData,
			}),
		}),
	}),
});

export const { useLoginPlayerMutation } = authApi;
