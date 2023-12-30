import { Link } from "react-router-dom";
import styles from "./Friends.module.scss";

import { useFriends } from "./hooks/useFriends";
import SearchField from "@/components/Input/SearchField";
import PlayersGrid from "@/components/Players/PlayersGrid";
type Props = {};

const Friends = (props: Props) => {
	const { filter, onChange, friends } = useFriends();
	return (
		<div className={styles.container}>
			<div className={styles.search_wrapper}>
				<SearchField
					value={filter}
					onChange={onChange}
					placeholder="Filter..."
					wrapperStyles={{
						borderRadius: "75px",
						width: "350px",
						margin: "0 auto",
					}}
				/>
				<Link className={styles.find_link} to={"/dashboard/players"}>
					Looking for a friend?
				</Link>
			</div>
			<PlayersGrid players={friends} />
		</div>
	);
};

export default Friends;
