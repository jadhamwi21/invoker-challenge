import { PlayerInfo } from "@/types/player.types";
import React from "react";
import InvokerHeader from "@/assets/images/InvokerHead.png";
import styles from "./PlayerInfoHeader.module.scss";

type Props = {
	player: Pick<PlayerInfo, "firstname" | "lastname" | "username">;
};

const PlayerInfoHeader = ({ player }: Props) => {
	return (
		<div className={styles.container}>
			<div className={styles.head_wrapper}>
				<img src={InvokerHeader} />
				<p>{player.username}</p>
			</div>
			<div className={styles.name}>
				<span>{player.firstname}</span> <span>{player.lastname}</span>
			</div>
		</div>
	);
};

export default PlayerInfoHeader;
