import { useGameContext } from "../../contexts/GameContext";
import styles from "./HeartbeatContainer.module.scss";

type Props = {};

const formatHeartbeat = (seconds: number) => {
	const mm = Math.floor(seconds / 60)
		.toString()
		.padStart(2, "0");
	const ss = (seconds % 60).toString().padStart(2, "0");
	return `${mm}:${ss}`;
};

const HeartbeatContainer = (props: Props) => {
	const { heartbeat } = useGameContext()
	console.log(heartbeat);

	return (
		<div className={styles.container}>
			{heartbeat !== null && formatHeartbeat(heartbeat)}
		</div>
	);
};

export default HeartbeatContainer;
