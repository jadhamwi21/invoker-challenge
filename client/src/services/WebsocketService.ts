import { store } from "@/redux/store";

export default class WebsocketService {
	private static ws: WebSocket;

	public static async setup(sessionId: string) {
		const dispatch = store.dispatch;
		const token = store.getState().Player.details.token;

		return new Promise<void>((resolve, reject) => {
			this.ws = new WebSocket(
				`ws://localhost:8080/ws/${sessionId}?jwt=${token}`
			);

			this.ws.onmessage = (ev) => {
				console.log(ev);
			};
			this.ws.onopen = () => {
				this.ws.send("ready");
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
