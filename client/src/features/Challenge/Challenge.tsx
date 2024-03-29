import Modal from "@/components/Modal/Modal";
import {
	pushNewChallenge,
	selectChallenge,
} from "@/redux/slices/challenges.slice";
import { selectMatch, setSessionID } from "@/redux/slices/match.slice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import SSEService from "@/services/SSEService";
import type { Challenge } from "@/types/challenges.types";
import { isNull } from "lodash";
import { useNavigate } from "react-router-dom";
import { useEffectOnce } from "usehooks-ts";
import PendingChallengeModal from "./components/PendingChallenge/PendingChallengeModal";
import ChallengeForm from "./containers/ChallengeForm";

type Props = {};

const Challenge = (props: Props) => {
	const dispatch = useAppDispatch();
	const { pendingChallengeId } = useAppSelector(selectChallenge);
	const { sessionID } = useAppSelector(selectMatch);
	const navigate = useNavigate();
	useEffectOnce(() => {
		const cleanupFuncs = [
			SSEService.addListener("new:challenge", (data: Challenge) => {
				dispatch(pushNewChallenge(data));
			}),
			SSEService.addListener("create:session", (sessionId: string) => {
				dispatch(setSessionID(sessionId));
			}),
			SSEService.addListener("start:match", (sessionId: string) => {
				navigate(`/match/${sessionId}`);

			}),
		];
		return () =>
			cleanupFuncs.forEach((cleanup) => {
				cleanup();
			});
	});
	return (
		<>
			<ChallengeForm />
			<Modal
				opened={!isNull(pendingChallengeId) && isNull(sessionID)}
				closeBehavior="none"
			>
				<PendingChallengeModal />
			</Modal>
		</>
	);
};

export default Challenge;
