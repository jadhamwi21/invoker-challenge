import { setGameConnectionStatus } from "@/redux/slices/game.slice";
import { store } from "@/redux/store";
import { EnMatchConnectionStatus } from "@/types/game.types";

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
				console.log(ev.data);
			};
			this.ws.onopen = () => {
				dispatch(setGameConnectionStatus(EnMatchConnectionStatus.Connected));
				resolve();
			};
			this.ws.onclose = () => {
				dispatch(setGameConnectionStatus(EnMatchConnectionStatus.Disconnected));
			};
			this.ws.onerror = (e) => {
				console.log(e);
				reject();
			};
		});
	}
}
