import Modal from "@/components/Modal/Modal";
import {
	pushNewChallenge,
	selectChallenge,
} from "@/redux/slices/challenges.slice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import SSEService from "@/services/SSEService";
import type { Challenge } from "@/types/challenges.types";
import { isNull } from "lodash";
import { useEffectOnce } from "usehooks-ts";
import PendingChallengeModal from "./components/PendingChallenge/PendingChallengeModal";
import ChallengeForm from "./containers/ChallengeForm";

type Props = {};

const Challenge = (props: Props) => {
	const dispatch = useAppDispatch();
	const { pendingChallengeId } = useAppSelector(selectChallenge);
	useEffectOnce(() => {
		const id = SSEService.addListener("new:challenge", (data: Challenge) => {
			dispatch(pushNewChallenge(data));
		});
		return () => {
			SSEService.removeListener(id);
		};
	});
	return (
		<>
			<ChallengeForm />
			<Modal
				opened={!isNull(pendingChallengeId)}
				closeBehavior="none"
				closeHandler={() => {}}
			>
				<PendingChallengeModal />
			</Modal>
		</>
	);
};

export default Challenge;
