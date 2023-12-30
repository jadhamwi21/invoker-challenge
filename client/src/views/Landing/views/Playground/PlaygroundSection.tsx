import Playground from "@/features/Playground/Playground";
import React from "react";
import styles from "./PlaygroundSection.module.scss";

type Props = {};

const PlaygroundSection = (props: Props) => {
	return (
		<div className={styles.container}>
			<h1 className={styles.header}>Playground</h1>
			<p className={styles.subheader}>
				A Playground to Warmup or Practice your Invokation Skills
			</p>
			<Playground />
		</div>
	);
};

export default PlaygroundSection;
