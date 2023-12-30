import React from "react";
import styles from "./PlayersGrid.module.scss";
import { Player } from "@/types/player.types";
import PlayerItem from "./PlayerItem";
type Props = { players: Player[] };

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
