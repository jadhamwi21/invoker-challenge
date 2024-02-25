import Keys from "@/components/Keys/Keys";
import Spell from "@/components/Spell/Spell";
import InvokerPortraitContainer from "@/containers/InvokerPortrait/InvokerPortraitContainer";
import { InvokationKeysType } from "@/types/invoker.types";
import EventEmitter from "eventemitter3";
import PlayerProperties from "../../components/PlayerProperties/PlayerProperties";
import { PlayerGameProperties } from "../../hooks/useGame";
import styles from "./InvokationContainer.module.scss";
type Props = {
	onKeyDown?: (key: InvokationKeysType) => void;
	player?: PlayerGameProperties;
	readOnly?: boolean;
	emitter?: EventEmitter;
};

const InvokationContainer = ({
	onKeyDown,
	player,
	readOnly,
	emitter,
}: Props) => {
	return (
		<div className={styles.container}>
			<PlayerProperties name={player.name} score={player.score} />
			<InvokerPortraitContainer orbs={player.orbs} />
			<Spell spell={player.spell} />
			<Keys onKeyDown={onKeyDown} readOnly={readOnly} emitter={emitter} />
		</div>
	);
};

export default InvokationContainer;
