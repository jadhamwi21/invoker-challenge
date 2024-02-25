import { selectChallenge } from "@/redux/slices/challenges.slice";
import { selectPlayer } from "@/redux/slices/player.slice";
import { useAppSelector } from "@/redux/store";
import { EnOrb, EnSpell } from "@/types/invoker.types";
import EventEmitter from "eventemitter3";
import { useRef, useState } from "react";

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
	const [player1, setPlayer1] = useState<PlayerGameProperties>({
		orbs: [],
		spell: null,
		score: 0,
		name: "hello you motherfucker",
	});

	const emitterRef = useRef(new EventEmitter());

	const [player2, setPlayer2] = useState<PlayerGameProperties>({
		orbs: [],
		spell: null,
		score: 0,
		name: friend,
	});

	return { player1, player2, emitter: emitterRef.current };
};
