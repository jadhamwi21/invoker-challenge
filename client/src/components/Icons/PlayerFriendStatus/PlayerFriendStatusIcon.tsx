import Button from "@/components/Button/Button";
import {
	IconDefinition,
	faClock,
	faMinus,
	faPlus,
	faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./PlayerFriendStatusIcon.module.scss";
import { ComponentProps } from "react";

type IconType = "add" | "remove" | "pending";

const ICON_MAP: Record<IconType, IconDefinition> = {
	add: faPlus,
	remove: faMinus,
	pending: faClock,
};

type Props = {
	type: IconType;
} & Omit<ComponentProps<typeof Button>, "children" | "type">;

const PlayerFriendStatusIcon = ({ type, ...other }: Props) => {
	const symbolClass = [styles[`${type}_symbol`], styles.symbol].join(" ");
	return (
		<Button variant="secondary" style={{ padding: "0.5em" }} {...other}>
			<div className={symbolClass}>
				<FontAwesomeIcon icon={ICON_MAP[type]} size="1x" />
			</div>
			<FontAwesomeIcon icon={faUserGroup} />
		</Button>
	);
};

export default PlayerFriendStatusIcon;
