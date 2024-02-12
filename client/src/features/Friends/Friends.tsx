import { Link } from "react-router-dom";
import styles from "./Friends.module.scss";

import SearchField from "@/components/Input/SearchField";
import PlayersGrid from "@/components/Players/PlayersGrid";
import { useFriends } from "./hooks/useFriends";
type Props = {};

const Friends = (props: Props) => {
	const { filter, onChange, friends, isLoading } = useFriends();
	return (
		!isLoading && (
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
				<PlayersGrid
					players={
						filter
							? friends.filter((friend) =>
									friend.toLowerCase().includes(filter.toLowerCase())
							  )
							: friends
					}
				/>
			</div>
		)
	);
};

export default Friends;
