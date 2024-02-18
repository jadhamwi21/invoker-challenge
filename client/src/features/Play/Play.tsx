import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import Select from "@/components/Select/Select";
import { useGetClientFriendsQuery } from "@/redux/apis/friends.api";
import { selectPlay, setPlayFriend } from "@/redux/slices/play.slice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import styles from "./Play.module.scss";
type Props = {};

const Play = (props: Props) => {
	const { data, isLoading } = useGetClientFriendsQuery();
	const { friend } = useAppSelector(selectPlay);
	const dispatch = useAppDispatch();
	return (
		<div className={styles.container}>
			{isLoading ? (
				<div>Loading...</div>
			) : (
				<>
					<Select
						onChange={(val) => {
							dispatch(setPlayFriend(val));
						}}
						value={friend}
						list={[
							{ label: "Select a friend...", value: null },
							...data.map((friend) => ({ label: friend, value: friend })),
						]}
						label="Friend"
					/>
					<Input label="Duration" />
					<Button variant="secondary">Challenge Friend</Button>
				</>
			)}
		</div>
	);
};

export default Play;
