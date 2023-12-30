import { Player } from "@/types/player.types";

const FRIENDS: Player[] = [{ name: "Jad" }, { name: "Aws" }, { name: "Seif" }];

export class FriendsService {
	public static getFriends(): Player[] {
		return FRIENDS;
	}
}
