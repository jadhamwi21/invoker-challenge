import { PlayerDetails } from "@/types/player.types";
import { useNavigate } from "react-router-dom";
import styles from "./PlayerItem.module.scss";
type Props = { player: string; style?: React.CSSProperties };

const PlayerItem = ({ player, style }: Props) => {
	const navigate = useNavigate();
	return (
		<div
			className={styles.container}
			style={style}
			onClick={() => navigate(`/dashboard/players/${player}`)}
		>
			{player}
		</div>
	);
};

export default PlayerItem;
