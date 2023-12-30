import { SPELLS } from "@/constants/constants";
import { SPELLS_ORB_COMBINATION } from "@/constants/constants";
import { EnOrb } from "@/types/invoker.types";
import _, { isEqual } from "lodash";
import { EnSpell } from "@/types/invoker.types";

export enum EnSpellsGenerator {
	OFFLINE,
	ONLINE,
}

export interface ISpellsGenerator {
	generate: () => EnSpell;
	validateInvokation: (spell: EnSpell, orbs: EnOrb[]) => boolean;
}

export class OfflineSpellsGenerator implements ISpellsGenerator {
	private lastSpell: EnSpell | null = null;
	public generate(): EnSpell {
		const spellsToPickFrom = [...SPELLS].filter(
			(spell) => spell !== this.lastSpell
		);
		const spellPicked = _.sample(spellsToPickFrom)!;
		this.lastSpell = spellPicked;
		return spellPicked;
	}
	public validateInvokation(spell: EnSpell, orbs: EnOrb[]) {
		const sortedOrbs = orbs.sort();
		const sortedSpellOrbs = SPELLS_ORB_COMBINATION[spell].sort();

		return isEqual(sortedOrbs, sortedSpellOrbs);
	}
}

export class OnlineSpellsGenerator implements ISpellsGenerator {
	public generate(): EnSpell {
		return EnSpell.COLD_SNAP;
	}
	public validateInvokation(spell: EnSpell, orbs: EnOrb[]) {
		const sortedOrbs = orbs.sort();
		const sortedSpellOrbs = SPELLS_ORB_COMBINATION[spell].sort();

		return isEqual(sortedOrbs, sortedSpellOrbs);
	}
}

export const getSpellsGeneratorInstance = (serviceType: EnSpellsGenerator) => {
	switch (serviceType) {
		case EnSpellsGenerator.OFFLINE:
			return new OfflineSpellsGenerator();
		case EnSpellsGenerator.ONLINE:
			return new OnlineSpellsGenerator();
	}
};
