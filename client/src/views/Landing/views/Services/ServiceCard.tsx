import React from "react";
import styles from "./ServiceCard.module.scss";
type Props = { icon: string; content: string; title: string };

const ServiceCard = ({ icon: logo, content, title }: Props) => {
	return (
		<div className={styles.container}>
			<img src={logo} />
			<h3>{title}</h3>
			<p>{content}</p>
		</div>
	);
};

export default ServiceCard;
