import AcceptedIcon from "@/assets/icons/accept.png";
import DeniedIcon from "@/assets/icons/deny.png";
import HappinesIcon from "@/assets/images/happiness.png";
import Loader from "@/components/Loader/Loader";
import { selectChallenge } from "@/redux/slices/challenges.slice";
import { useAppSelector } from "@/redux/store";
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
	accepted: `Your challenge is accepted, please wait...`,
	denied: `Your challenge is denied`,
};

const PendingChallengeModal = (props: Props) => {
	const { pendingChallengeId } = useAppSelector(selectChallenge);
	const [response, setResponse] = useState<ChallengeRequestReply>("unknown");
	useEffect(() => {
		const ids = [
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
		];
		return () => ids.forEach((id) => SSEService.removeListener(id));
	}, [pendingChallengeId]);

	return (
		<div className={styles.container}>
			<img src={StatusIconMap[response]} className={styles.icon} />
			<p>{StatusTextMap[response]}</p>
			{response === "unknown" && (
				<div className={styles.loader_wrapper}>
					<Loader />
				</div>
			)}
		</div>
	);
};

export default PendingChallengeModal;
