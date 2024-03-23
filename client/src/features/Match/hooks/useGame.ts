import { KEY_TO_ORB_MAP } from "@/constants/constants";
import { isInvokeKey, isOrbKey } from "@/features/Playground/helpers/playground.helpers";
import { useLazyGetMatchQuery } from "@/redux/apis/match.api";
import { selectPlayer } from "@/redux/slices/player.slice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { joinMatch } from "@/redux/thunks/match.thunks";
import WebsocketService, {
	CountdownMessage,
	GeneratedSpellMessage,
	HeartbeatMessage,
	KeystrokeMessage,
	PauseMessage,
	ScoreMessage,
} from "@/services/WebsocketService";
import { EnSpell, InvokationKeysType } from "@/types/invoker.types";
import { PlayerState } from "@/types/player.types";
import { validateInvokation } from "@/utils/utils";
import EventEmitter from "eventemitter3";
import _ from "lodash";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

export type PlayerGameProperties = PlayerState & {
	name: string;
};

export const useGame = () => {
	const {
		details: { username },
	} = useAppSelector(selectPlayer);

	const { sessionID } = useParams<{ sessionID: string }>()
	const [getMatch] = useLazyGetMatchQuery()



	const dispatch = useAppDispatch();
	const emitterRef = useRef(new EventEmitter());
	const [heartbeat, setHeartbeat] = useState<number | null>(null);

	const [client, setClient] = useState<PlayerGameProperties>({
		name: "", current_spell: null, invoked_spells: [], score: 0, last_spell: -1, orbs: []
	});
	const [opponent, setOpponent] = useState<PlayerGameProperties>({
		name: "", current_spell: null, invoked_spells: [], score: 0, last_spell: -1, orbs: []
	});


	const clientRef = useRef(client);
	useEffect(() => {
		clientRef.current = client;
	});
	const clientKeyDownHandler = (key: InvokationKeysType) => {
		if (isOrbKey(key))
			WebsocketService.send({ event: "keystroke", data: key });


		if (isInvokeKey(key)) {
			const { current_spell, orbs } = clientRef.current;
			const isValid = validateInvokation(current_spell, [...orbs]);

			if (isValid)
				WebsocketService.send({
					event: "invoke",
					data: client.orbs,
				});
		} else {
			setClient((prev) => {
				const newOrbs = [...prev.orbs];
				if (newOrbs.length === 3) {
					newOrbs.pop();
				}
				newOrbs.unshift(KEY_TO_ORB_MAP[key]);
				return { ...prev, orbs: newOrbs };
			});
		}
	};
	const [pause, setPause] = useState<{ show: boolean; timer: number }>({ show: false, timer: 0 });

	useEffect(() => {

		(async function () {
			await dispatch(joinMatch(sessionID))
				.unwrap()
				.then(() => {
					getMatch(sessionID).unwrap().then((data) => {
						WebsocketService.addHandler("keystroke", ({ data }: KeystrokeMessage) => {

							setOpponent((prev) => {
								const newOrbs = [...prev.orbs];
								if (newOrbs.length === 3) {
									newOrbs.pop();
								}

								newOrbs.unshift(KEY_TO_ORB_MAP[data]);
								return { ...prev, orbs: newOrbs };
							});
							emitterRef.current.emit("opponent-keypress", data);
						});
						WebsocketService.addHandler("pause", (message: PauseMessage) => {
							setPause({ show: message.data.pause, timer: message.data.timer });
						})
						WebsocketService.addHandler(
							"generated_spell",
							(spell: GeneratedSpellMessage) => {
								if (spell.data.username === username) {
									setClient((prev) => ({
										...prev,
										current_spell: spell.data.spell as EnSpell,
									}));
								} else {
									setOpponent((prev) => ({
										...prev,
										current_spell: spell.data.spell as EnSpell,
									}));
								}
							}
						);
						WebsocketService.addHandler("countdown", (countdown: CountdownMessage) => {

							if (countdown.data.countdown === 0) {
								WebsocketService.send({ event: "generate:spell" });
							}
						});
						WebsocketService.addHandler("score", (score: ScoreMessage) => {
							if (score.data.username === username) {
								setClient((prev) => ({
									...prev,
									score: score.data.score,
								}));
							} else {
								setOpponent((prev) => ({
									...prev,
									score: score.data.score,
								}));
							}
						});
						WebsocketService.addHandler("heartbeat", (message: HeartbeatMessage) => {
							setHeartbeat(+message.data);
						});
						setHeartbeat(data.state.timestamp)
						Object.keys(_.omit(data, "state")).forEach((k) => {
							const value = _.omit(data[k], ["current_spell"]);
							if (k === username) {
								setClient({ ...client, ...value, name: k })
							} else {
								setOpponent({ ...opponent, ...value, name: k })
							}
						})
					}).then(() => {
						WebsocketService.send({ event: "ready" });

					})
				});
		})();
	}, []);

	return {
		client,
		opponent,
		emitter: emitterRef.current,
		clientKeyDownHandler, heartbeat,
		pause
	};
};
