import { selectMatch } from "@/redux/slices/match.slice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { joinMatch } from "@/redux/thunks/match.thunks";
import { useState } from "react";
import { useEffectOnce } from "usehooks-ts";
import styles from "./MatchConnectModal.module.scss";
type Props = {};

const MatchConnectModal = (props: Props) => {
	const { sessionID } = useAppSelector(selectMatch);
	const dispatch = useAppDispatch();
	const [connected, setConnected] = useState<null | boolean>(null);
	useEffectOnce(() => {
		dispatch(joinMatch(sessionID))
			.unwrap()
			.then(() => setConnected(true))
			.catch(() => setConnected(false));
	});
	return (
		<div className={styles.container}>
			{connected === null
				? `Connecting...`
				: connected
				? "Connected, Redirecting in few seconds"
				: "Couldn't connect"}
		</div>
	);
};

export default MatchConnectModal;
