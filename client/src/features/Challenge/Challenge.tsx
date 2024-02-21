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
import { seconds } from "milliseconds";
import { useEffectOnce } from "usehooks-ts";
import MatchConnectModal from "./components/MatchConnect/MatchConnectModal";
import PendingChallengeModal from "./components/PendingChallenge/PendingChallengeModal";
import ChallengeForm from "./containers/ChallengeForm";

type Props = {};

const Challenge = (props: Props) => {
	const dispatch = useAppDispatch();
	const { pendingChallengeId } = useAppSelector(selectChallenge);
	const { connectionStatus, sessionID } = useAppSelector(selectMatch);
	useEffectOnce(() => {
		const ids = [
			SSEService.addListener("new:challenge", (data: Challenge) => {
				dispatch(pushNewChallenge(data));
			}),
			SSEService.addListener("create:session", (sessionId: string) => {
				setTimeout(() => {
					dispatch(setSessionID(sessionId));
				}, seconds(1.5));
			}),
		];
		return () =>
			ids.forEach((id) => {
				SSEService.removeListener(id);
			});
	});

	return (
		<>
			<ChallengeForm />
			<Modal opened={!isNull(pendingChallengeId)} closeBehavior="none">
				<PendingChallengeModal />
			</Modal>
			<Modal opened={!isNull(sessionID)} closeBehavior="none">
				<MatchConnectModal />
			</Modal>
		</>
	);
};

export default Challenge;
