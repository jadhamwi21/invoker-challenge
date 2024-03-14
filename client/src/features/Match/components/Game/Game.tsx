import ClientGameContainer from "../../containers/Client/ClientGameContainer";
import OpponentGameContainer from "../../containers/Opponent/OpponentGameContainer";
import styles from "./Game.module.scss";
type Props = {};

const Game = (props: Props) => {
	return (
		<div className={styles.container}>
			<div className={styles.wrapper}>

				<ClientGameContainer />
				<OpponentGameContainer />

			</div>
		</div>
	);
};

export default Game;
