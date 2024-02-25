import InvokationContainer from "../../containers/Invokation/InvokationContainer";
import { useGame } from "../../hooks/useGame";
import styles from "./Game.module.scss";
type Props = {};

const Game = (props: Props) => {
	const { player1, player2, emitter } = useGame();
	return (
		<div className={styles.container}>
			<div className={styles.wrapper}>
				<InvokationContainer player={player1} />
				<InvokationContainer player={player2} emitter={emitter} />
			</div>
		</div>
	);
};

export default Game;
