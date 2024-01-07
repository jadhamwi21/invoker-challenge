import InvokerHeader from "@/assets/images/InvokerHead.png";

import {
	useAcceptFriendRequestMutation,
	useGetFriendStatusQuery,
	useNewFriendRequestMutation,
	useRejectFriendRequestMutation,
	useRemoveFriendMutation,
} from "@/redux/apis/friends.api";
import { PlayerInfo } from "@/types/player.types";
import styles from "./PlayerInfoHeader.module.scss";
import PlayerFriendStatusIcon from "@/components/Icons/PlayerFriendStatus/PlayerFriendStatusIcon";
import { useCallback, useMemo } from "react";
import Button from "@/components/Button/Button";

type Props = {
	player: Pick<PlayerInfo, "firstname" | "lastname" | "username">;
};

const PlayerInfoHeader = ({ player }: Props) => {
	const { data, isLoading: statusLoading } = useGetFriendStatusQuery(
		player.username
	);

	const [newFriendRequest, { isLoading: friendRequestLoading }] =
		useNewFriendRequestMutation();
	const [rejectFriendRequest, { isLoading: friendRequestRejectLoading }] =
		useRejectFriendRequestMutation();
	const [acceptFriendRequest, { isLoading: friendRequestAcceptLoading }] =
		useAcceptFriendRequestMutation();
	const [removeFriend, { isLoading: removeFriendLoading }] =
		useRemoveFriendMutation();

	const clickHandler = useCallback(async () => {
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
				acceptFriendRequest({ id: data.requestId, username: player.username });
			}
		}
	}, [data]);
	const rejectClickHandler = useCallback(async () => {
		if (data) {
			if (data.status === "pending-your-response") {
				rejectFriendRequest({ id: data.requestId, username: player.username });
			}
		}
	}, [data]);

	return (
		<div className={styles.container}>
			<div className={styles.head_wrapper}>
				<img src={InvokerHeader} />
				<p>{player.username}</p>

				{statusLoading ? null : data.status !== "pending-your-response" ? (
					<PlayerFriendStatusIcon
						disabled={
							friendRequestLoading ||
							friendRequestAcceptLoading ||
							friendRequestRejectLoading
						}
						type={
							data.status === "friend"
								? "remove"
								: data.status === "not-friend"
								? "add"
								: "pending"
						}
						onClick={clickHandler}
					/>
				) : (
					<div>
						<Button onClick={acceptClickHandler}>Accept</Button>
						<Button onClick={rejectClickHandler}>Reject</Button>
					</div>
				)}
			</div>
			<div className={styles.name}>
				<span>{player.firstname}</span> <span>{player.lastname}</span>
			</div>
		</div>
	);
};

export default PlayerInfoHeader;
