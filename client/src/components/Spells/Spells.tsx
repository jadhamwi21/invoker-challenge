import React from "react";
import styles from "./Spells.module.scss";
import { SPELLS } from "@/constants/constants";
import Spell from "./Spell";
type Props = {};

const Spells = (props: Props) => {
	return (
		<div className={styles.container}>
			{SPELLS.map((spell) => (
				<Spell key={spell} spell={spell} />
			))}
		</div>
	);
};

export default Spells;
