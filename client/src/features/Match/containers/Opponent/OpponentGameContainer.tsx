import { useGameContext } from "../../contexts/GameContext";
import InvokationContainer from "../Invokation/InvokationContainer";

type Props = {};

const OpponentGameContainer = (props: Props) => {
	const { opponent, emitter } = useGameContext();
	return <InvokationContainer player={opponent} readOnly emitter={emitter} />;
};

export default OpponentGameContainer;
