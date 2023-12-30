import React from "react";
import styles from "./ServicesSection.module.scss";
import ServiceCard from "./ServiceCard";
import PlaygroundIcon from "@/assets/images/Playground.png";
import CompetitiveIcon from "@/assets/images/Competitive.png";
import ChallengesHistoryIcon from "@/assets/images/ChallengesHistory.png";
type Props = {};

const ServicesSection = (props: Props) => {
	return (
		<div className={styles.container}>
			<ServiceCard
				icon={PlaygroundIcon}
				content={
					"Our playground is your go-to spot for a quick warmup and laid-back practice."
				}
				title={"Playground"}
			/>
			<ServiceCard
				icon={CompetitiveIcon}
				content={
					"Have fun competing with your friends to find out who's the quickest at casting spells! "
				}
				title={"Competitive"}
			/>
			<ServiceCard
				icon={ChallengesHistoryIcon}
				content={
					"Explore your spellcasting journey with Challenges History. See past challenges, track your progress, and relive magical moments."
				}
				title={"Challenges History"}
			/>
		</div>
	);
};

export default ServicesSection;
