import {
	faBell,
	faChartBar,
	faGamepad,
	faGears,
	faGhost,
	faHandFist,
	faHome,
	faPlay,
	faUserFriends,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./SideBar.module.scss";
import SideBarItem from "./SideBarItem";
import Profile from "./ProfileItem";
import { useAppSelector } from "@/redux/store";
import { selectPlayer } from "@/redux/slices/player.slice";
type Props = {};

const SideBar = (props: Props) => {
	const { details } = useAppSelector(selectPlayer);
	return (
		<div className={styles.container}>
			<Profile name={details ? details.username : "..."} />
			<ul className={styles.list}>
				<SideBarItem icon={faChartBar} label="Stats" route="stats" />
				<SideBarItem icon={faGamepad} label="Play" route="play" />
				<SideBarItem icon={faHandFist} label="Playground" route="playground" />
				<SideBarItem icon={faUserFriends} label="Players" route="players" />
				<SideBarItem icon={faUserFriends} label="Friends" route="friends" />
				<SideBarItem
					icon={faBell}
					label="Notifications"
					route="notifications"
				/>
			</ul>
		</div>
	);
};

export default SideBar;
