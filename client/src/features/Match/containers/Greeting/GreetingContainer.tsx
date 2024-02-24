import Modal from "@/components/Modal/Modal";
import { selectPlayer } from "@/redux/slices/player.slice";
import { useAppSelector } from "@/redux/store";
import WebsocketService from "@/services/WebsocketService";
import { useEffect, useState } from "react";
import styles from "./GreetingContainer.module.scss";
type Props = {};

const GreetingContainer = (props: Props) => {
	const [greeted, setGreeted] = useState(false);
	const player = useAppSelector(selectPlayer);
	useEffect(() => {
		setTimeout(() => {
			WebsocketService.send({ event: "ready" });
			setGreeted(true);
		}, 2000);
	}, []);
	return (
		<Modal opened={!greeted} closeBehavior="none">
			<p className={styles.text}>
				<p>The match will begin...</p>
				<p>
					GL & HF{" "}
					<span className={styles.name}>
						[ {player.details.firstname.toUpperCase()} ]
					</span>
				</p>
			</p>
		</Modal>
	);
};

export default GreetingContainer;
