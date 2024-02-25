import { SPELLS_ORB_COMBINATION } from "@/constants/constants";
import { EnOrb, EnSpell } from "@/types/invoker.types";
import axios from "axios";
import { isEqual } from "lodash";

export const axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_BASE_URL,
});

export const validateInvokation = (spell: EnSpell, orbs: EnOrb[]) => {
	const sortedOrbs = orbs.sort();
	const sortedSpellOrbs = SPELLS_ORB_COMBINATION[spell].sort();

	return isEqual(sortedOrbs, sortedSpellOrbs);
};
