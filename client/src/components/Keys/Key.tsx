import { KEY_TO_ICON_MAP } from "@/constants/constants";
import { isInvokationKey } from "@/features/Playground/helpers/playground.helpers";
import { InvokationKeysType as InvokationKeyType } from "@/types/invoker.types";
import EventEmitter from "eventemitter3";
import { useEffect, useState } from "react";
import styles from "./Key.module.scss";
type Props = { value: InvokationKeyType; emitter?: EventEmitter };

const Key = ({ value, emitter }: Props) => {
	const [isDown, setIsDown] = useState(false);
	useEffect(() => {
		if (emitter) {
			const emitterHandler = async (key: InvokationKeyType) => {
				if (key === value) {
					setIsDown(true);
					await new Promise((resolve) => setTimeout(resolve, 50));
					setIsDown(false);
				}
			};
			emitter.on("key", emitterHandler);
			return () => emitter.off("key", emitterHandler);
		} else {
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
