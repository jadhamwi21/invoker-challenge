import { store } from "@/redux/store";
import { uniqueId } from "lodash";

type ServerEvent = "heartbeat" | "countdown";
type ClientEvent = "ready";

type EventType = ServerEvent | ClientEvent;

type Message<T extends EventType, K = unknown> = { event: T; data?: K };

export type HeartbeatMessage = Message<"heartbeat", string>;
export type CountdownMessage = Message<"heartbeat", number>;

type ReadyMessage = Message<"ready">;
type ClientMessage = ReadyMessage;

export default class WebsocketService {
	private static ws: WebSocket;
	private static handlersMap: Record<
		string,
		Record<string, (data: any) => void>
	> = {
		heartbeat: {},
		countdown: {},
	};
	public static send(message: ClientMessage) {
		this.ws.send(JSON.stringify(message));
	}

	public static addHandler<T extends ServerEvent>(
		type: T,
		cb: (msg: any) => void
	) {
		const id = uniqueId();
		this.handlersMap[type][id] = cb;
		return () => {
			delete this.handlersMap[type][id];
		};
	}

	public static async setup(sessionId: string) {
		const token = store.getState().Player.details.token;

		return new Promise<void>((resolve, reject) => {
			this.ws = new WebSocket(
				`ws://localhost:8080/ws/${sessionId}?jwt=${token}`
			);

			this.ws.onmessage = (ev) => {
				const data: Message<ServerEvent> = JSON.parse(ev.data);
				if (this.handlersMap[data.event]) {
					Object.values(this.handlersMap[data.event]).forEach((cb) => cb(data));
				}
			};
			this.ws.onopen = () => {
				resolve();
			};
			this.ws.onclose = reject;
			this.ws.onerror = (e) => {
				console.log(e);
				reject();
			};
		});
	}
}
