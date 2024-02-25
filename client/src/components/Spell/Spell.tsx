import { SPELL_TO_ICON_MAP } from "@/constants/constants";
import { EnSpell } from "@/types/invoker.types";
import styles from "./Spell.module.scss";
type Props = {
	spell: EnSpell;
};

const Spell = ({ spell }: Props) => {
	return (
		<>
			{spell ? (
				<img src={SPELL_TO_ICON_MAP[spell]} className={styles.spell} />
			) : (
				<div className={styles.spell} />
			)}
		</>
	);
};

export default Spell;
