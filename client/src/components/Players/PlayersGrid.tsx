import React from "react";
import styles from "./PlayersGrid.module.scss";
import { PlayerDetails } from "@/types/player.types";
import PlayerItem from "./PlayerItem";
type Props = { players: PlayerDetails[] };

const PlayersGrid = ({ players }: Props) => {
	return (
		<div className={styles.grid}>
			{players.map((player) => (
				<PlayerItem key={player.name} player={player} />
			))}
		</div>
	);
};

export default PlayersGrid;
