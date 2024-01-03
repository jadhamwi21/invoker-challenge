import Button from "@/components/Button/Button";
import { IconDefinition, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import styles from "./SideBarItem.module.scss";
import { useLocation, useNavigate } from "react-router-dom";

type Props = {
	icon: IconDefinition;
	label: string;
	onClick?: () => void;
	route?: string;
};

const SideBarItem = ({ icon, label, onClick, route }: Props) => {
	const navigate = useNavigate();
	const onClickHandler = () => {
		if (route) {
			navigate(route);
		}
		if (onClick) {
			onClick();
		}
	};
	const location = useLocation();
	const classes =
		location.pathname === `/dashboard/${route}`
			? [styles.list, styles.selected]
			: [styles.list];

	return (
		<li className={classes.join(" ")}>
			<Button variant="secondary" onClick={onClickHandler}>
				<div className={styles.wrapper}>
					<FontAwesomeIcon icon={icon} color="var(--blue)" />
					<p>{label}</p>
				</div>
			</Button>
		</li>
	);
};

export default SideBarItem;
