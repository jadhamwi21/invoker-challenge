import PlayerItem from "./PlayerItem";
import styles from "./PlayersGrid.module.scss";
type Props = { players: string[] };

const PlayersGrid = ({ players }: Props) => {
	return (
		<div className={styles.grid}>
			{players.map((player) => (
				<PlayerItem key={player} player={player} />
			))}
		</div>
	);
};

export default PlayersGrid;
