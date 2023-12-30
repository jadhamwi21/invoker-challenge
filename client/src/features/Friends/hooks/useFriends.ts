import { FriendsService } from "@/services/FriendsService";
import _ from "lodash";
import { useEffect, useRef, useState } from "react";

export const useFriends = () => {
	const [filter, setFilter] = useState("");

	const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) =>
		setFilter(e.target.value);

	const [friends, setFriends] = useState<{ name: string }[]>([]);
	const searchHandler = () => {
		let friends = FriendsService.getFriends();

		if (filter) {
			friends = friends.filter((friend) =>
				friend.name.toLowerCase().includes(filter.toLowerCase())
			);
		}
		setFriends(friends);
	};
	useEffect(searchHandler, [filter]);

	return { onChange, filter, friends };
};
