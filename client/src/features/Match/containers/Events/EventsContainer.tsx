import Modal from "@/components/Modal/Modal";
import Greeting from "../../components/Greeting/Greeting";
import Pause from "../../components/Pause/Pause";
import { useGameContext } from "../../contexts/GameContext";
type Props = {};

const EventsContainer = (props: Props) => {


	const { greeted, paused } = useGameContext();

	return (
		<Modal opened={!greeted || paused} closeBehavior="none">
			{!greeted ? <Greeting /> : paused ? <Pause /> : null}
		</Modal>
	);
};

export default EventsContainer;
