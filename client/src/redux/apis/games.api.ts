// Need to use the React-specific entry point to import createApi
import { NewGameRequest } from "@/types/game.types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const gamesApi = createApi({
	reducerPath: "gamesApi",
	baseQuery: fetchBaseQuery({
		baseUrl: `${import.meta.env.VITE_BASE_URL}/games`,
		credentials: "include",
	}),
	endpoints: (builder) => ({
		newGame: builder.mutation<void, NewGameRequest>({
			query: (formData) => ({
				url: "/",
				method: "POST",
				body: formData,
			}),
		}),
	}),
});

export const { useNewGameMutation } = gamesApi;
