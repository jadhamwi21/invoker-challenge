import {
	ORB_TO_ICON_MAP,
	SPELLS_ORB_COMBINATION,
	SPELL_TO_ICON_MAP,
	SPELL_TO_NAME_MAP,
} from "@/constants/constants";
import { EnSpell } from "@/types/invoker.types";
import styles from "./Spell.module.scss";

type Props = { spell: EnSpell };

const Spell = ({ spell }: Props) => {
	return (
		<div className={styles.wrapper}>
			<div>
				<img src={SPELL_TO_ICON_MAP[spell]} />
				<h4>{SPELL_TO_NAME_MAP[spell]}</h4>
			</div>
			<div>
				{SPELLS_ORB_COMBINATION[spell].map((orb, index) => (
					<img src={ORB_TO_ICON_MAP[orb]} key={index} />
				))}
			</div>
		</div>
	);
};

export default Spell;
