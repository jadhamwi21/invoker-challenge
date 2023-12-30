import React from "react";
import styles from "./Keys.module.scss";
import Key from "./Key";
type Props = {};

const Keys = (props: Props) => {
	return (
		<div className={styles.wrapper}>
			<Key value="Q" />
			<Key value="W" />
			<Key value="E" />
			<Key value="R" />
		</div>
	);
};

export default Keys;
