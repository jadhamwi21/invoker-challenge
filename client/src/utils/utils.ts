import { SPELLS_ORB_COMBINATION } from "@/constants/constants";
import { EnSpell, EnOrb } from "@/types/invoker.types";
import { isEqual } from "lodash";

export const validateInvokation = (spell: EnSpell, orbs: EnOrb[]) => {
	const sortedOrbs = orbs.sort();
	const sortedSpellOrbs = SPELLS_ORB_COMBINATION[spell].sort();

	return isEqual(sortedOrbs, sortedSpellOrbs);
};
