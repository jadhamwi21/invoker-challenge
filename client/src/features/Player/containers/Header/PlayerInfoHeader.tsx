import InvokerHeader from "@/assets/images/InvokerHead.png";

import Button from "@/components/Button/Button";
import PlayerFriendStatusIcon from "@/components/Icons/PlayerFriendStatus/PlayerFriendStatusIcon";
import { PlayerInfo } from "@/types/player.types";
import { faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./PlayerInfoHeader.module.scss";
import { usePlayerInfoHeader } from "./usePlayerInfoHeader";

type Props = {
	player: Pick<PlayerInfo, "firstname" | "lastname" | "username">;
};

const PlayerInfoHeader = ({ player }: Props) => {
	const {
		loading,
		disabled,
		data,
		iconClickHandler,
		acceptClickHandler,
		rejectClickHandler,
	} = usePlayerInfoHeader(player);

	return (
		<div className={styles.container}>
			<div className={styles.head_wrapper}>
				<img src={InvokerHeader} />
				<p>{player.username}</p>

				{loading ? null : data.status !== "pending-your-response" ? (
					<PlayerFriendStatusIcon
						disabled={disabled}
						type={
							data.status === "friend"
								? "remove"
								: data.status === "not-friend"
								? "add"
								: "pending"
						}
						onClick={iconClickHandler}
					/>
				) : (
					<div className={styles.accept_reject_wrapper}>
						<Button onClick={acceptClickHandler} variant="secondary">
							Accept
						</Button>
						<FontAwesomeIcon icon={faUserGroup} />
						<Button onClick={rejectClickHandler} variant="secondary">
							Reject
						</Button>
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
