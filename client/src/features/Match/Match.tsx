import WebsocketService, {
	CountdownMessage,
} from "@/services/WebsocketService";
import { useEffect, useState } from "react";

type Props = {};

const Match = (props: Props) => {
	const [countdown, setCountdown] = useState(null);
	const [heartbeat, setHeartbeat] = useState(null);
	useEffect(() => {
		WebsocketService.addHandler("countdown", (message: CountdownMessage) => {
			setCountdown(message.data);
		});
		WebsocketService.addHandler("heartbeat", (message: CountdownMessage) => {
			setHeartbeat(message.data);
		});
		WebsocketService.send({ event: "ready" });
	}, []);
	return (
		<>
			<div style={{ color: "red" }}>Countdown : {countdown}</div>
			<div style={{ color: "red" }}>Heartbeat : {heartbeat}</div>
		</>
	);
};

export default Match;
