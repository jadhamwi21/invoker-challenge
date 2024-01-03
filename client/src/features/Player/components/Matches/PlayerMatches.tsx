import PlayersGrid from "@/components/Players/PlayersGrid";
import React from "react";
import styles from "./PlayerMatches.module.scss";
import PlayerItem from "@/components/Players/PlayerItem";

type Props = {};

const PlayerMatches = (props: Props) => {
	return (
		<div className={styles.container}>
			<div>Matches</div>
			<div className={styles.flexbox}></div>
		</div>
	);
};

export default PlayerMatches;
