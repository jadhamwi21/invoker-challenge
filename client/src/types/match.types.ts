export enum EnMatchConnectionStatus {
	Connected,
	Disconnected,
	None,
}

export type NewMatchRequest = { sessionId: string; opponent: string };
