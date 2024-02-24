import AcceptedIcon from "@/assets/icons/accept.png";
import DeniedIcon from "@/assets/icons/deny.png";
import HappinesIcon from "@/assets/images/happiness.png";
import Button from "@/components/Button/Button";
import Loader from "@/components/Loader/Loader";
import { useCancelChallengeMutation } from "@/redux/apis/challenges.api";
import { useNewMatchMutation } from "@/redux/apis/match.api";
import {
	selectChallenge,
	setPendingChallengeId,
} from "@/redux/slices/challenges.slice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import SSEService from "@/services/SSEService";
import { useEffect, useState } from "react";
import styles from "./PendingChallengeModal.module.scss";
type Props = {};

type ChallengeRequestReply = "accepted" | "denied" | "unknown";

const StatusIconMap: Record<ChallengeRequestReply, string> = {
	unknown: HappinesIcon,
	accepted: AcceptedIcon,
	denied: DeniedIcon,
};

const StatusTextMap: Record<ChallengeRequestReply, string> = {
	unknown: `Waiting for challenge reply...`,
	accepted: `Your challenge is accepted`,
	denied: `Your challenge is denied`,
};

const ButtonTextMap: Record<
	Exclude<ChallengeRequestReply, "accepted">,
	string
> = {
	unknown: `Cancel`,
	denied: `Close`,
};

const PendingChallengeModal = (props: Props) => {
	const dispatch = useAppDispatch();
	const { pendingChallengeId, friend } = useAppSelector(selectChallenge);
	const [response, setResponse] = useState<ChallengeRequestReply>("unknown");
	const [cancelChallenge] = useCancelChallengeMutation();
	const [newMatch] = useNewMatchMutation();
	useEffect(() => {
		const cleanupFuncs = [
			SSEService.addListener("deny:challenge", (id) => {
				if (id == pendingChallengeId) {
					setResponse("denied");
				}
			}),
			SSEService.addListener("accept:challenge", (id) => {
				if (id == pendingChallengeId) {
					setResponse("accepted");
				}
			}),
			SSEService.addListener("create:session", (sessionId: string) => {
				newMatch({ sessionId: sessionId, opponent: friend });
			}),
		];
		return () =>
			cleanupFuncs.forEach((cleanup) => {
				cleanup();
			});
	}, [pendingChallengeId]);

	const clickHandler = () => {
		if (response === "denied") {
			dispatch(setPendingChallengeId(null));
		}
		if (response === "unknown") {
			cancelChallenge(pendingChallengeId);
		}
		setResponse("unknown");
	};

	return (
		<div className={styles.container}>
			<img src={StatusIconMap[response]} className={styles.icon} />
			<p>{StatusTextMap[response]}</p>
			{response === "unknown" && (
				<div className={styles.loader_wrapper}>
					<Loader />
				</div>
			)}
			{response !== "accepted" && (
				<Button
					onClick={clickHandler}
					style={{ width: "fit-content", margin: "auto" }}
				>
					{ButtonTextMap[response]}
				</Button>
			)}
		</div>
	);
};

export default PendingChallengeModal;
