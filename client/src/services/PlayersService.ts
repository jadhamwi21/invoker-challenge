import { PlayerDetails } from "@/types/player.types";

const FRIENDS: PlayerDetails[] = [
	{ name: "Jad" },
	{ name: "Aws" },
	{ name: "Seif" },
];

export class PlayersService {
	public static async findPlayers(name: string): Promise<PlayerDetails[]> {
		await new Promise((resolve) => setTimeout(resolve, 5000));
		return FRIENDS.filter((friend) =>
			friend.name.toLowerCase().includes(name.toLowerCase())
		);
	}
}
