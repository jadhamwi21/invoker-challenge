import styles from "./PlayerProperties.module.scss";
type Props = { name: string; score: number };

const PlayerProperties = ({ name, score }: Props) => {
	return (
		<div className={styles.container}>
			<p className={styles.name}>{name}</p>

			<p className={styles.score}>Score: {score}</p>
		</div>
	);
};

export default PlayerProperties;
