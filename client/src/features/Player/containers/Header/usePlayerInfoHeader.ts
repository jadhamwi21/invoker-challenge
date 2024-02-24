import {
	useAcceptFriendRequestMutation,
	useGetFriendStatusQuery,
	useNewFriendRequestMutation,
	useRejectFriendRequestMutation,
	useRemoveFriendMutation,
} from "@/redux/apis/friends.api";
import SSEService from "@/services/SSEService";
import { RequestMessage } from "@/types/friend.types";
import { PlayerInfo } from "@/types/player.types";
import { useCallback, useEffect } from "react";

export const usePlayerInfoHeader = (
	player: Pick<PlayerInfo, "firstname" | "lastname" | "username">
) => {
	const {
		data,
		isLoading: statusLoading,
		refetch,
	} = useGetFriendStatusQuery(player.username);

	useEffect(() => {
		const fetchStatus = (data: RequestMessage) => {
			if (data.username === player.username) {
				refetch();
			}
		};
		const cleanupFuncs = [
			SSEService.addListener("friend-request", fetchStatus),
			SSEService.addListener("accept:friend-request", fetchStatus),
			SSEService.addListener("reject:friend-request", fetchStatus),
			SSEService.addListener("friend-remove", fetchStatus),
		];
		return () =>
			cleanupFuncs.forEach((cleanup) => {
				cleanup();
			});
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
