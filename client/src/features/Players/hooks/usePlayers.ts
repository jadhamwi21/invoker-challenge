import { PlayersService } from "@/services/PlayersService";
import { Player } from "@/types/player.types";
import { useState } from "react";

export const useFindFriend = () => {
	const [value, setValue] = useState("");
	const [finding, setFinding] = useState(false);
	const [players, setPlayers] = useState<Player[] | null>(null);
	const handleFind = async () => {
		setFinding(true);
		const players = await PlayersService.findPlayers(value);
		setPlayers(players);
		setFinding(false);
	};

	const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
		if (e.key === "Enter") {
			handleFind();
			e.currentTarget.blur();
		}
	};
	const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) =>
		setValue(e.target.value);

	return { handleFind, onKeyDown, finding, players, value, onChange };
};
