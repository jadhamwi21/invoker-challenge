import {
	useGetFriendStatusQuery,
	useNewFriendRequestMutation,
	useRejectFriendRequestMutation,
	useAcceptFriendRequestMutation,
	useRemoveFriendMutation,
} from "@/redux/apis/friends.api";
import SSEService from "@/services/SSEService";
import { FriendRequestMessage } from "@/types/friend.types";
import { PlayerInfo } from "@/types/player.types";
import { useEffect, useCallback } from "react";

export const usePlayerInfoHeader = (
	player: Pick<PlayerInfo, "firstname" | "lastname" | "username">
) => {
	const {
		data,
		isLoading: statusLoading,
		refetch,
	} = useGetFriendStatusQuery(player.username);

	useEffect(() => {
		const fetchStatus = (data: FriendRequestMessage) => {
			console.log(data);

			if (data.username === player.username) {
				refetch();
			}
		};
		const ids = [
			SSEService.addListener("friend-request", fetchStatus),
			SSEService.addListener("friend-request:accept", fetchStatus),
			SSEService.addListener("friend-request:reject", fetchStatus),
			SSEService.addListener("friend-remove", fetchStatus),
		];
		return () => {
			ids.forEach((id) => {
				console.log("unsubscribed from", id);

				SSEService.removeListener(id);
			});
		};
	}, []);

	const [newFriendRequest, { isLoading: friendRequestLoading }] =
		useNewFriendRequestMutation();
	const [rejectFriendRequest, { isLoading: friendRequestRejectLoading }] =
		useRejectFriendRequestMutation();
	const [acceptFriendRequest, { isLoading: friendRequestAcceptLoading }] =
		useAcceptFriendRequestMutation();
	const [removeFriend, { isLoading: removeFriendLoading }] =
		useRemoveFriendMutation();

	const iconClickHandler = useCallback(async () => {
		if (data) {
			switch (data.status) {
				case "not-friend":
					newFriendRequest(player.username);
					break;
				case "friend":
					removeFriend(player.username);
					break;
				case "pending-his-response":
					rejectFriendRequest({
						id: data.requestId,
						username: player.username,
					});
					break;
			}
		}
	}, [data]);
	const acceptClickHandler = useCallback(async () => {
		if (data) {
			if (data.status === "pending-your-response") {
				acceptFriendRequest({
					id: data.requestId,
					username: player.username,
				});
			}
		}
	}, [data]);
	const rejectClickHandler = useCallback(async () => {
		if (data) {
			if (data.status === "pending-your-response") {
				rejectFriendRequest({
					id: data.requestId,
					username: player.username,
				});
			}
		}
	}, [data]);

	const disabled =
		removeFriendLoading ||
		friendRequestLoading ||
		friendRequestAcceptLoading ||
		friendRequestRejectLoading;

	return {
		disabled,
		loading: statusLoading,
		data,
		rejectClickHandler,
		acceptClickHandler,
		iconClickHandler,
	};
};
