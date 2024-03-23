import { useGameContext } from "../../contexts/GameContext";
import styles from "./Pause.module.scss";
type Props = {};

const Pause = (props: Props) => {
	const { pause } = useGameContext();
	return (
		<p className={styles.text}>
			<p>
				The match is paused, wait your opponent to reconnect in [ {pause.timer}{" "}
				]
			</p>
		</p>
	);
};

export default Pause;
