import { InvokationKeysType } from "@/types/invoker.types";
import EventEmitter from "eventemitter3";
import Key from "./Key";
import styles from "./Keys.module.scss";
type Props = {
	onKeyDown?: (key: InvokationKeysType) => void;
	readOnly?: boolean;
	emitter?: EventEmitter;
};

const KEYS: InvokationKeysType[] = ["Q", "W", "E", "R"];

const Keys = (props: Props) => {
	return (
		<div className={styles.wrapper}>
			{KEYS.map((key) => (
				<Key key={key} {...props} value={key} />
			))}
		</div>
	);
};

export default Keys;
