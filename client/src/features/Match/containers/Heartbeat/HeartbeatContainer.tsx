import WebsocketService, {
	CountdownMessage,
} from "@/services/WebsocketService";
import { useEffect, useState } from "react";
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
	const [heartbeat, setHeartbeat] = useState<null | number>(null);
	useEffect(() => {
		WebsocketService.addHandler("heartbeat", (message: CountdownMessage) => {
			setHeartbeat(message.data);
		});
	}, []);
	return (
		<div className={styles.container}>
			{heartbeat !== null && formatHeartbeat(heartbeat)}
		</div>
	);
};

export default HeartbeatContainer;
