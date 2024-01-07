// Need to use the React-specific entry point to import createApi
import { NotificationType } from "@/types/notifications.types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const notificationsApi = createApi({
	reducerPath: "notificationsApi",
	baseQuery: fetchBaseQuery({
		baseUrl: `${import.meta.env.VITE_BASE_URL}/notifications`,
		credentials: "include",
	}),
	tagTypes: ["Notifications"],
	endpoints: (builder) => ({
		getNotifications: builder.query<NotificationType[], void>({
			query: () => ({
				url: "/",
				method: "GET",
			}),
			providesTags: ["Notifications"],
		}),
		updateNotificationsToSeen: builder.mutation<NotificationType[], void>({
			query: () => ({
				url: "/seen",
				method: "PUT",
			}),
			invalidatesTags: ["Notifications"],
		}),
	}),
});

export const {
	useGetNotificationsQuery,
	useUpdateNotificationsToSeenMutation,
} = notificationsApi;
