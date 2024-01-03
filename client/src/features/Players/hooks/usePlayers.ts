import { playersApi, useSearchPlayerQuery } from "@/redux/apis/players.api";
import { useState } from "react";

export const useFindFriend = () => {
	const [value, setValue] = useState("");
	const [trigger, { isLoading, data: players }] =
		playersApi.useLazySearchPlayerQuery();

	const handleFind = async () => {
		trigger(value);
	};

	const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
		if (e.key === "Enter") {
			handleFind();
			e.currentTarget.blur();
		}
	};
	const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) =>
		setValue(e.target.value);

	return { handleFind, onKeyDown, isLoading, players, value, onChange };
};
