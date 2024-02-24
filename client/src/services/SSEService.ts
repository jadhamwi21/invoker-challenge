import { v4 as uuid } from "uuid";

type FriendEvent =
	| "friend-request"
	| "friend-remove"
	| "accept:friend-request"
	| "reject:friend-request";

type MatchEvent = "start:match";

type ChallengeEvent =
	| "new:challenge"
	| "accept:challenge"
	| "deny:challenge"
	| "cancel:challenge";

type SessionEvent = "create:session";

type SSEventType =
	| FriendEvent
	| "notification"
	| ChallengeEvent
	| SessionEvent
	| MatchEvent;

type SSEMessageType = { type: SSEventType; data: any };

export default class SSEService {
	private static sse: EventSource;
	private static handlersMap: Record<
		SSEventType,
		Record<string, (data: any) => void>
	> = {
		"friend-request": {},
		"accept:friend-request": {},
		"reject:friend-request": {},
		"friend-remove": {},
		notification: {},
		"new:challenge": {},
		"accept:challenge": {},
		"deny:challenge": {},
		"cancel:challenge": {},
		"create:session": {},
		"start:match": {},
	};
	public static async setup() {
		this.sse = new EventSource(`${import.meta.env.VITE_BASE_URL}/sse`, {
			withCredentials: true,
		});

		this.sse.onmessage = (e) => {
			const { data, type }: SSEMessageType = JSON.parse(e.data);
			console.log(data, type);

			if (this.handlersMap[type]) {
				Object.values(this.handlersMap[type]).forEach((cb) => cb(data));
			}
		};
	}
	public static addListener(type: SSEventType, handler: (data: any) => void) {
		const id = uuid();
		this.handlersMap[type][id] = handler;
		return () => {
			delete this.handlersMap[type][id];
		};
	}
}
