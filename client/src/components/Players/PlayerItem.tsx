import { PlayerDetails } from "@/types/player.types";
import { useNavigate } from "react-router-dom";
import styles from "./PlayerItem.module.scss";
type Props = { player: PlayerDetails };

const PlayerItem = ({ player }: Props) => {
	const navigate = useNavigate();
	return (
		<div
			className={styles.container}
			onClick={() => navigate(`/dashboard/players/${player.name}`)}
		>
			{player.name}
		</div>
	);
};

export default PlayerItem;
