import EventEmitter from "eventemitter3";
import Key from "./Key";
import styles from "./Keys.module.scss";
type Props = {
	emitter?: EventEmitter;
};

const Keys = ({ emitter }: Props) => {
	return (
		<div className={styles.wrapper}>
			<Key value="Q" emitter={emitter} />
			<Key value="W" emitter={emitter} />
			<Key value="E" emitter={emitter} />
			<Key value="R" emitter={emitter} />
		</div>
	);
};

export default Keys;
