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
		loginPlayer: builder.mutation<
			Pick<PlayerDetails, "firstname" | "lastname" | "username">,
			PlayerCredentials
		>({
			query: (formData) => ({
				url: "login",
				method: "POST",
				body: formData,
			}),
			transformResponse: (value, _, arg) => {
				return { ...(value as any), username: arg.username };
			},
		}),
	}),
});

export const { useLoginPlayerMutation } = authApi;
