import { KEY_TO_ICON_MAP } from "@/constants/constants";
import { isInvokationKey } from "@/features/Playground/helpers/playground.helpers";
import { InvokationKeysType } from "@/types/invoker.types";
import EventEmitter from "eventemitter3";
import { useEffect, useState } from "react";
import styles from "./Key.module.scss";
type Props = {
	value: InvokationKeysType;
	onKeyDown?: (key: InvokationKeysType) => void;
	readOnly?: boolean;
	emitter?: EventEmitter;
};

const Key = ({ value, onKeyDown, readOnly, emitter }: Props) => {
	const [isDown, setIsDown] = useState(false);
	useEffect(() => {
		if (!readOnly) {
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
					onKeyDown(key);
				}
			};
			window.addEventListener("keydown", onKeyDownHandler);
			window.addEventListener("keyup", onKeyUpHandler);

			return () => {
				window.removeEventListener("keydown", onKeyDownHandler);
				window.removeEventListener("keyup", onKeyUpHandler);
			};
		}
	}, []);
	useEffect(() => {
		if (emitter) {
			const emitterHandler = async (key: InvokationKeysType) => {
				if (key === value) {
					setIsDown(true);
					await new Promise((resolve) => setTimeout(resolve, 50));
					setIsDown(false);
				}
			};
			emitter.on("opponent-keypress", emitterHandler);
			return () => {
				emitter.off("opponent-keypress", emitterHandler);
			};
		}
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
