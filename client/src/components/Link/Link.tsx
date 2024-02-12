import React from "react";
import { LinkProps, Link as RouterLink } from "react-router-dom";
import styles from "./Link.module.scss";

type Props = { children: React.ReactNode } & LinkProps;

const Link = ({ children, ...other }: Props) => {
	return (
		<RouterLink {...other} className={styles.link}>
			{children}
		</RouterLink>
	);
};

export default Link;
