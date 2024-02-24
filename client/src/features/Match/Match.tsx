import Transition from "@/layouts/Transitions/Transitions";
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
		</Transition>
	);
};

export default Match;
