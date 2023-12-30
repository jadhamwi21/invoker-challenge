import React from "react";
import styles from "./Spell.module.scss";
import { EnSpell } from "@/types/invoker.types";
import { SPELL_TO_ICON_MAP } from "@/constants/constants";
type Props = {
	spell: EnSpell;
};

const Spell = ({ spell }: Props) => {
	return <img src={SPELL_TO_ICON_MAP[spell]} className={styles.spell} />;
};

export default Spell;
