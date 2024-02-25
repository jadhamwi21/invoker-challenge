import { useGameContext } from "../../contexts/GameContext";
import InvokationContainer from "../Invokation/InvokationContainer";

type Props = {};

const ClientGameContainer = (props: Props) => {
	const { client, clientKeyDownHandler } = useGameContext();
	return (
		<InvokationContainer player={client} onKeyDown={clientKeyDownHandler} />
	);
};

export default ClientGameContainer;
