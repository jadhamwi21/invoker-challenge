import Keys from "@/components/Keys/Keys";
import Spell from "@/components/Spell/Spell";
import InvokerPortraitContainer from "@/containers/InvokerPortrait/InvokerPortraitContainer";
import EventEmitter from "eventemitter3";
import PlayerProperties from "../../components/PlayerProperties/PlayerProperties";
import { PlayerGameProperties } from "../../hooks/useGame";
import styles from "./InvokationContainer.module.scss";
type Props = {
	player?: PlayerGameProperties;
	emitter?: EventEmitter;
};

const InvokationContainer = ({ player, emitter }: Props) => {
	return (
		<div className={styles.container}>
			<PlayerProperties name={player.name} score={player.score} />
			<InvokerPortraitContainer orbs={player.orbs} />
			<Spell spell={player.spell} />
			<Keys emitter={emitter} />
		</div>
	);
};

export default InvokationContainer;
