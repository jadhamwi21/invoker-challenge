import Transition from "@/layouts/Transitions/Transitions";
import Game from "./components/Game/Game";
import CountdownContainer from "./containers/Countdown/CountdownContainer";
import GreetingContainer from "./containers/Greeting/GreetingContainer";
import HeartbeatContainer from "./containers/Heartbeat/HeartbeatContainer";

type Props = {};

const Match = (props: Props) => {
	return (
		<Transition>
			<GreetingContainer />
			<CountdownContainer />
			<HeartbeatContainer />
			<Game />
		</Transition>
	);
};

export default Match;
