type FriendRequestEventsType =
	| "friend-request"
	| "friend-request:accept"
	| "friend-request:reject";

type SSEventType = FriendRequestEventsType | "notification";

type SSEMessageType = { type: SSEventType; data: any };

export default class SSEService {
	private static sse: EventSource;
	public static handlersMap: Record<SSEventType, (data: any) => void>;
	public static async setup() {
		this.sse = new EventSource(`${import.meta.env.VITE_BASE_URL}/sse`, {
			withCredentials: true,
		});

		this.sse.onmessage = (e) => {
			const { data, type }: SSEMessageType = JSON.parse(e.data);
			console.log(data, type);

			if (this.handlersMap[type]) {
				this.handlersMap[type](data);
			}
		};
	}
}
