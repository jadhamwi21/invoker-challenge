import { SPELLS } from "@/constants/constants";
import { EnSpell } from "@/types/invoker.types";
import _ from "lodash";

export class PlaygroundSpellsGenerator {
	private lastSpell: EnSpell | null = null;
	public generate(): EnSpell {
		const spellsToPickFrom = [...SPELLS].filter(
			(spell) => spell !== this.lastSpell
		);
		const spellPicked = _.sample(spellsToPickFrom)!;
		this.lastSpell = spellPicked;
		return spellPicked;
	}
}
