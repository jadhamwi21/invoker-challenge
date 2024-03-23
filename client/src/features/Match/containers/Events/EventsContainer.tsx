import Modal from "@/components/Modal/Modal";
import Pause from "../../components/Pause/Pause";
import { useGameContext } from "../../contexts/GameContext";
type Props = {};

const EventsContainer = (props: Props) => {
	const { pause } = useGameContext();

	return (
		<Modal opened={pause.show} closeBehavior="none">
			{pause.show ? <Pause /> : null}
		</Modal>
	);
};

export default EventsContainer;
