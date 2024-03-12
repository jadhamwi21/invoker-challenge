import Modal from "@/components/Modal/Modal";
import { selectPlayer } from "@/redux/slices/player.slice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { joinMatch } from "@/redux/thunks/match.thunks";
import WebsocketService from "@/services/WebsocketService";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./GreetingContainer.module.scss";
type Props = {};

const GreetingContainer = (props: Props) => {
	const [greeted, setGreeted] = useState(false);
	const player = useAppSelector(selectPlayer);
	const { sessionID } = useParams<{ sessionID: string }>();
	const dispatch = useAppDispatch();
	useEffect(() => {
		(async function () {
			await dispatch(joinMatch(sessionID))
				.unwrap()
				.then(() => {
					setTimeout(() => {
						WebsocketService.send({ event: "ready" });
						setGreeted(true);
					}, 2000);
				});
		})();
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
