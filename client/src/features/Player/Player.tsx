import Loader from "@/components/Loader/Loader";
import { useGetPlayerInfoQuery } from "@/redux/apis/players.api";
import { useParams } from "react-router-dom";
import PlayerFriends from "./components/Friends/PlayerFriends";
import PlayerInfoHeader from "./containers/Header/PlayerInfoHeader";
import styles from "./Player.module.scss";
import PlayerMatches from "./components/Matches/PlayerMatches";
type Props = {};

const Player = (props: Props) => {
	const { slug } = useParams<{ slug: string }>();
	const { isLoading, data: player } = useGetPlayerInfoQuery(slug);
	return (
		<>
			{isLoading ? (
				<Loader />
			) : (
				<div className={styles.container}>
					<PlayerInfoHeader player={player} />
					<div className={styles.wrapper}>
						<PlayerFriends friends={player.friends} />
						<PlayerMatches />
					</div>
				</div>
			)}
		</>
	);
};

export default Player;
