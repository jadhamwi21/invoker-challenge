export enum EnMatchConnectionStatus {
	Connected,
	Disconnected,
	None,
}

export type NewGameRequest = { sessionId: string; opponent: string };
