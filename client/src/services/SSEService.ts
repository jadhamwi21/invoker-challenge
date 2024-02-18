import { v4 as uuid } from "uuid";

type FriendEvent =
	| "friend-request"
	| "friend-remove"
	| "friend-request:accept"
	| "friend-request:reject";

type SSEventType = FriendEvent | "notification" | "challenge";

type HandlerPath = `${SSEventType}.${string}`;
type SSEMessageType = { type: SSEventType; data: any };

export default class SSEService {
	private static sse: EventSource;
	private static handlersMap: Record<
		SSEventType,
		Record<string, (data: any) => void>
	> = {
		"friend-request": {},
		"friend-request:accept": {},
		"friend-request:reject": {},
		"friend-remove": {},
		notification: {},
		challenge: {},
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
		const path: HandlerPath = `${type}.${id}`;
		this.handlersMap[type][id] = handler;
		return path;
	}
	public static removeListener(path: HandlerPath) {
		const [type, id] = path.split(".") as [SSEventType, string];
		delete this.handlersMap[type][id];
	}
}
