import { PlayerDetails } from "@/types/player.types";

const FRIENDS: PlayerDetails[] = [
	{ name: "Jad" },
	{ name: "Aws" },
	{ name: "Seif" },
];

export class FriendsService {
	public static getFriends(): PlayerDetails[] {
		return FRIENDS;
	}
}
