import { Player } from "@/types/player.types";

const FRIENDS: Player[] = [{ name: "Jad" }, { name: "Aws" }, { name: "Seif" }];

export class PlayersService {
	public static async findPlayers(name: string): Promise<Player[]> {
		await new Promise((resolve) => setTimeout(resolve, 5000));
		return FRIENDS.filter((friend) =>
			friend.name.toLowerCase().includes(name.toLowerCase())
		);
	}
}
