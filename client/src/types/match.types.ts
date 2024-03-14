import { PlayerState } from "./player.types";

export enum EnMatchConnectionStatus {
	Connected,
	Disconnected,
	None,
}

export type NewMatchRequest = { sessionId: string; opponent: string };


export type MatchState = { timestamp: number }


export type MatchType = Record<string, PlayerState> & { state: MatchState }