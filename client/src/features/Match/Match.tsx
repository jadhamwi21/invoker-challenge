import Transition from "@/layouts/Transitions/Transitions";
import Game from "./components/Game/Game";
import CountdownContainer from "./containers/Countdown/CountdownContainer";
import EventsContainer from "./containers/Events/EventsContainer";
import HeartbeatContainer from "./containers/Heartbeat/HeartbeatContainer";
import { GameContextProvider } from "./contexts/GameContext";

type Props = {};

const Match = (props: Props) => {
	return (
		<Transition>
			<GameContextProvider>

				<EventsContainer />
				<CountdownContainer />
				<HeartbeatContainer />
				<Game />
			</GameContextProvider>
		</Transition>
	);
};

export default Match;
