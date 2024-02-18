import Modal from "@/components/Modal/Modal";
import { selectMatchMake } from "@/redux/slices/matchmake.slice";
import { useAppSelector } from "@/redux/store";
import PendingAcceptModal from "./components/PendingAcceptModal";
import ChallengeForm from "./containers/ChallengeForm";

type Props = {};

const Challenge = (props: Props) => {
	const { pendingAccept } = useAppSelector(selectMatchMake);
	return (
		<>
			<ChallengeForm />
			<Modal
				opened={pendingAccept}
				closeBehavior="none"
				closeHandler={() => {}}
			>
				<PendingAcceptModal />
			</Modal>
		</>
	);
};

export default Challenge;
