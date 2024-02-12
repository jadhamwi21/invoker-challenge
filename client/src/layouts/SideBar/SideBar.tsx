import { useGetNotificationsQuery } from "@/redux/apis/notifications.api";
import { selectPlayer } from "@/redux/slices/player.slice";
import { useAppSelector } from "@/redux/store";
import {
	faBell,
	faChartBar,
	faGamepad,
	faHandFist,
	faUserFriends,
} from "@fortawesome/free-solid-svg-icons";
import Profile from "./ProfileItem";
import styles from "./SideBar.module.scss";
import SideBarItem from "./SideBarItem";
type Props = {};

const SideBar = (props: Props) => {
	const { details } = useAppSelector(selectPlayer);

	const { data: notifications } = useGetNotificationsQuery();
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
					count={
						notifications
							? notifications.reduce(
									(total, current) => (total += Number(!current.seen)),
									0
							  )
							: undefined
					}
				/>
			</ul>
		</div>
	);
};

export default SideBar;
