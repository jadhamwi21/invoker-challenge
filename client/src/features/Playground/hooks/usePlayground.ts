import { KEY_TO_ORB_MAP } from "@/constants/constants";
import {
	EnSpellsGenerator,
	getSpellsGeneratorInstance,
} from "@/services/SpellsService";
import { EnOrb } from "@/types/invoker.types";
import { useEffect, useRef, useState } from "react";
import { isInvokeKey, isOrbKey } from "../helpers/playground.helpers";

export const usePlayground = () => {
	const spellsService = useRef(
		getSpellsGeneratorInstance(EnSpellsGenerator.OFFLINE)
	);

	const [spell, setSpell] = useState(() => spellsService.current.generate());

	const [orbs, setOrbs] = useState<EnOrb[]>([]);
	const [counter, setCounter] = useState(0);

	const orbsRef = useRef(orbs);
	const spellRef = useRef(spell);

	const resetHandler = () => {
		const generatedSpell = spellsService.current.generate();
		setOrbs([]);
		setCounter(0);
		setSpell(generatedSpell);
		orbsRef.current = [];
		spellRef.current = generatedSpell;
	};

	useEffect(() => {
		const keyClickHandler = (ev: KeyboardEvent) => {
			if (ev.repeat) return;
			const key = ev.key.toUpperCase();
			if (isOrbKey(key)) {
				setOrbs((prevOrbs) => {
					const newOrbs = [...prevOrbs];
					if (newOrbs.length === 3) newOrbs.pop();
					newOrbs.unshift(KEY_TO_ORB_MAP[key]);
					orbsRef.current = newOrbs;
					return newOrbs;
				});
			}

			if (isInvokeKey(key)) {
				const correctInvokation = spellsService.current.validateInvokation(
					spellRef.current,
					orbsRef.current
				);

				if (correctInvokation) {
					const newSpell = spellsService.current.generate();
					setSpell(newSpell);
					setCounter((prev) => prev + 1);
					spellRef.current = newSpell;
				}
			}
		};

		window.addEventListener("keydown", keyClickHandler);

		return () => window.removeEventListener("keydown", keyClickHandler);
	}, []);

	return { spell, orbs, counter, resetHandler };
};
