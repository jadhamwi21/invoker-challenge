import { FriendStatusResponse } from "@/types/friend.types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const friendsApi = createApi({
	reducerPath: "friendsApi",
	baseQuery: fetchBaseQuery({
		baseUrl: `${import.meta.env.VITE_BASE_URL}/`,
	}),
	tagTypes: ["Status"],

	endpoints: (builder) => ({
		getClientFriends: builder.query<string[], void>({
			query: () => ({
				url: `friends`,
				method: "Get",
				credentials: "include",
				cache: "no-cache",
			}),
		}),
		getFriendStatus: builder.query<FriendStatusResponse, string>({
			query: (username) => ({
				url: `friend/${username}/status`,
				method: "Get",
				credentials: "include",
			}),
			providesTags: (result, error, username) => [
				{ type: "Status", id: username },
			],
		}),
		newFriendRequest: builder.mutation<void, string>({
			query: (username) => ({
				url: `friend/request`,
				method: "POST",
				credentials: "include",
				body: {
					username,
				},
			}),
			invalidatesTags: (result, error, username) => [
				{ type: "Status", id: username },
			],
		}),
		rejectFriendRequest: builder.mutation<
			void,
			{ id: string; username: string }
		>({
			query: (args) => ({
				url: `friend/reject/${args.id}`,
				method: "POST",
				credentials: "include",
			}),
			invalidatesTags: (result, error, args) => [
				{ type: "Status", id: args.username },
			],
		}),
		acceptFriendRequest: builder.mutation<
			void,
			{ id: string; username: string }
		>({
			query: (args) => ({
				url: `friend/accept/${args.id}`,
				method: "POST",
				credentials: "include",
			}),
			invalidatesTags: (result, error, args) => [
				{ type: "Status", id: args.username },
			],
		}),
		removeFriend: builder.mutation<void, string>({
			query: (username) => ({
				url: `friend/${username}`,
				method: "DELETE",
				credentials: "include",
			}),
			invalidatesTags: (result, error, args) => [{ type: "Status", id: args }],
		}),
	}),
});

export const {
	useGetClientFriendsQuery,
	useGetFriendStatusQuery,
	useNewFriendRequestMutation,
	useAcceptFriendRequestMutation,
	useRejectFriendRequestMutation,
	useRemoveFriendMutation,
	useLazyGetClientFriendsQuery,
} = friendsApi;
