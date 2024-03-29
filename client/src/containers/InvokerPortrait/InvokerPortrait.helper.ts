import { EnOrb } from "@/types/invoker.types";
import styles from "./InvokerPortrait.module.scss";

type ClassesReturned = [string, string, string, string];

export const getInvokerPortraitClasses = (): ClassesReturned => {
	const leftOrbClasses = [styles.orb, styles.left_orb];
	const middleOrbClasses = [styles.orb, styles.middle_orb];
	const rightOrbClasses = [styles.orb, styles.right_orb];
	const invokerBodyClasses = [styles.invoker_body];
	return [
		leftOrbClasses,
		middleOrbClasses,
		rightOrbClasses,
		invokerBodyClasses,
	].map((classesArray) => classesArray.join(" ")) as ClassesReturned;
};

export const shouldAnimateOrbs = (animate: boolean, orbs: EnOrb[]): boolean => {
	return animate && orbs.length !== 0;
};
