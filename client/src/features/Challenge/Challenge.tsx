import Modal from "@/components/Modal/Modal";
import {
	pushNewChallenge,
	selectChallenge,
} from "@/redux/slices/challenges.slice";
import { selectGame, setSessionID } from "@/redux/slices/game.slice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { joinGame } from "@/redux/thunks/game.thunks";
import SSEService from "@/services/SSEService";
import type { Challenge } from "@/types/challenges.types";
import { isNull } from "lodash";
import { useEffectOnce } from "usehooks-ts";
import MatchConnectModal from "./components/MatchConnect/MatchConnectModal";
import PendingChallengeModal from "./components/PendingChallenge/PendingChallengeModal";
import ChallengeForm from "./containers/ChallengeForm";

type Props = {};

const Challenge = (props: Props) => {
	const dispatch = useAppDispatch();
	const { pendingChallengeId } = useAppSelector(selectChallenge);
	const { sessionID } = useAppSelector(selectGame);
	useEffectOnce(() => {
		const ids = [
			SSEService.addListener("new:challenge", (data: Challenge) => {
				dispatch(pushNewChallenge(data));
			}),
			SSEService.addListener("create:session", (sessionId: string) => {
				dispatch(setSessionID(sessionId));
			}),
			SSEService.addListener("start:game", (sessionId: string) => {
				dispatch(joinGame(sessionId))
					.unwrap()
					.then(() => alert("joined"));
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
			<Modal
				opened={!isNull(pendingChallengeId) && isNull(sessionID)}
				closeBehavior="none"
			>
				<PendingChallengeModal />
			</Modal>
			<Modal opened={!isNull(sessionID)} closeBehavior="none">
				<MatchConnectModal />
			</Modal>
		</>
	);
};

export default Challenge;
