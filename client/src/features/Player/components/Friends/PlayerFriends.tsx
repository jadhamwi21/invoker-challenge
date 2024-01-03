import PlayersGrid from "@/components/Players/PlayersGrid";
import React from "react";
import styles from "./PlayerFriends.module.scss";
import PlayerItem from "@/components/Players/PlayerItem";

type Props = { friends: string[] };

const PlayerFriends = ({ friends }: Props) => {
	return (
		<div className={styles.container}>
			<div>Friends</div>
			<div className={styles.flexbox}>
				{friends.map((friend) => (
					<>
						<PlayerItem key={friend} player={friend} />
					</>
				))}
			</div>
		</div>
	);
};

export default PlayerFriends;
