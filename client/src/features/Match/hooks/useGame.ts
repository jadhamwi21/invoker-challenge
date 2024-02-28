import { KEY_TO_ORB_MAP } from "@/constants/constants";
import { isInvokeKey } from "@/features/Playground/helpers/playground.helpers";
import { selectChallenge } from "@/redux/slices/challenges.slice";
import { selectPlayer } from "@/redux/slices/player.slice";
import { useAppSelector } from "@/redux/store";
import WebsocketService, {
	CountdownMessage,
	GeneratedSpellMessage,
	ScoreMessage,
} from "@/services/WebsocketService";
import { EnOrb, EnSpell, InvokationKeysType } from "@/types/invoker.types";
import { validateInvokation } from "@/utils/utils";
import EventEmitter from "eventemitter3";
import { useEffect, useRef, useState } from "react";

export type PlayerGameProperties = {
	orbs: EnOrb[];
	spell: EnSpell | null;
	score: number;
	name: string;
};

export const useGame = () => {
	const {
		details: { username },
	} = useAppSelector(selectPlayer);
	const { friend } = useAppSelector(selectChallenge);

	const emitterRef = useRef(new EventEmitter());
	const [client, setClient] = useState<PlayerGameProperties>({
		orbs: [],
		spell: null,
		score: 0,
		name: username,
	});

	const [opponent, setOpponent] = useState<PlayerGameProperties>({
		orbs: [],
		spell: null,
		score: 0,
		name: friend,
	});
	const clientRef = useRef(client);
	useEffect(() => {
		clientRef.current = client;
	});
	const clientKeyDownHandler = (key: InvokationKeysType) => {
		if (isInvokeKey(key)) {
			const { spell, orbs } = clientRef.current;
			const isValid = validateInvokation(spell, [...orbs]);

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

	useEffect(() => {
		WebsocketService.addHandler(
			"generated_spell",
			(spell: GeneratedSpellMessage) => {
				if (spell.data.username === username) {
					setClient((prev) => ({
						...prev,
						spell: spell.data.spell as EnSpell,
					}));
				} else {
					setOpponent((prev) => ({
						...prev,
						spell: spell.data.spell as EnSpell,
					}));
				}
			}
		);
		WebsocketService.addHandler("countdown", (countdown: CountdownMessage) => {
			if (countdown.data === 0) {
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
	}, []);

	return {
		client,
		opponent,
		emitter: emitterRef.current,
		clientKeyDownHandler,
	};
};
