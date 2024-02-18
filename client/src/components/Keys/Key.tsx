import { KEY_TO_ICON_MAP } from "@/constants/constants";
import { isInvokationKey } from "@/features/Playground/helpers/playground.helpers";
import { InvokationKeysType as InvokationKeyType } from "@/types/invoker.types";
import { useEffect, useState } from "react";
import styles from "./Key.module.scss";
type Props = { value: InvokationKeyType };

const Key = ({ value }: Props) => {
	const [isDown, setIsDown] = useState(false);
	useEffect(() => {
		const onKeyDownHandler = (ev: KeyboardEvent) => {
			if (ev.repeat) return;
			const key = ev.key.toUpperCase();
			if (isInvokationKey(key) && value === key) {
				setIsDown(true);
			}
		};
		const onKeyUpHandler = (ev: KeyboardEvent) => {
			if (ev.repeat) return;
			const key = ev.key.toUpperCase();
			if (isInvokationKey(key) && value === key) {
				setIsDown(false);
			}
		};
		window.addEventListener("keydown", onKeyDownHandler);
		window.addEventListener("keyup", onKeyUpHandler);

		return () => {
			window.removeEventListener("keydown", onKeyDownHandler);
			window.removeEventListener("keyup", onKeyUpHandler);
		};
	}, []);
	return (
		<div className={styles.keyContainer}>
			<img
				src={KEY_TO_ICON_MAP[value]}
				className={`${styles.keyImage} ${
					isDown ? styles.keyDown : styles.keyUp
				}`}
				alt={`Key ${value}`}
			/>
			<p className={styles.keyText}>{value}</p>
		</div>
	);
};

export default Key;
