import Modal from "@/components/Modal/Modal";
import Pause from "../../components/Pause/Pause";
import { useGameContext } from "../../contexts/GameContext";
type Props = {};

const EventsContainer = (props: Props) => {
	const { paused } = useGameContext();

	return (
		<Modal opened={paused} closeBehavior="none">
			{paused ? <Pause /> : null}
		</Modal>
	);
};

export default EventsContainer;
