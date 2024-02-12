import { useLazyGetClientFriendsQuery } from "@/redux/apis/friends.api";
import SSEService from "@/services/SSEService";
import { RequestMessage } from "@/types/friend.types";
import { useEffect, useState } from "react";

export const useFriends = () => {
	const [filter, setFilter] = useState("");

	const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) =>
		setFilter(e.target.value);

	const [getClientFriends, { isLoading }] = useLazyGetClientFriendsQuery();
	const [friends, setFriends] = useState<string[]>([]);
	useEffect(() => {
		(async function () {
			const { data } = await getClientFriends(undefined, false);
			setFriends(data);
			SSEService.addListener("friend-remove", (data: RequestMessage) => {
				setFriends((prev) =>
					[...prev].filter((friendName) => friendName !== data.username)
				);
			});
		})();
	}, []);

	return { onChange, filter, friends, isLoading };
};
