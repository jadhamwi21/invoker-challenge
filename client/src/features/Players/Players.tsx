import SearchField from "@/components/Input/SearchField";
import PlayersGrid from "@/components/Players/PlayersGrid";
import styles from "./Players.module.scss";
import { useFindFriend as usePlayers } from "./hooks/usePlayers";
type Props = {};

const Players = (props: Props) => {
	const { handleFind, onKeyDown, value, onChange, players, finding } =
		usePlayers();
	return (
		<div>
			<SearchField
				wrapperStyles={{
					borderRadius: "75px",
					width: "350px",
					margin: "0 auto",
				}}
				placeholder="Find..."
				iconOnClick={handleFind}
				onKeyDown={onKeyDown}
				onChange={onChange}
				value={value}
				searching={finding}
			/>
			<div>
				{players === null ? null : players.length === 0 ? (
					<div className={styles.no_results}>No Results</div>
				) : (
					<PlayersGrid players={players} />
				)}
			</div>
		</div>
	);
};

export default Players;
