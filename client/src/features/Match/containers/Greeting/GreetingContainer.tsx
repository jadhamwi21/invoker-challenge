import Modal from "@/components/Modal/Modal";
import { selectPlayer } from "@/redux/slices/player.slice";
import { useAppSelector } from "@/redux/store";
import { useGameContext } from "../../contexts/GameContext";
import styles from "./GreetingContainer.module.scss";
type Props = {};

const GreetingContainer = (props: Props) => {

	const player = useAppSelector(selectPlayer);
	const { greeted } = useGameContext();

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
