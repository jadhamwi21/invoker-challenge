import SwordsIcon from "@/assets/icons/swords.svg";
import Button from "@/components/Button/Button";
import {
	useAcceptChallengeMutation,
	useDenyChallengeMutation,
} from "@/redux/apis/challenges.api";
import {
	popChallenge,
	removeChallengeById,
} from "@/redux/slices/challenges.slice";
import { useAppDispatch } from "@/redux/store";
import SSEService from "@/services/SSEService";
import type { Challenge } from "@/types/challenges.types";
import { useState } from "react";
import { useEffectOnce } from "usehooks-ts";
import styles from "./Challenge.module.scss";
type Props = { challenge: Challenge };
const Challenge = ({ challenge }: Props) => {
	const dispatch = useAppDispatch();
	const [acceptChallenge] = useAcceptChallengeMutation();
	const [denyChallenge] = useDenyChallengeMutation();
	const onDeny = () => {
		denyChallenge(challenge.id);
	};
	const onAccept = () => {
		acceptChallenge(challenge.id);
	};
	const [cancelled, setCancelled] = useState(false);
	useEffectOnce(() => {
		const id = SSEService.addListener("cancel:challenge", (id) => {
			if (id == challenge.id) {
				setCancelled(true);
			} else {
				dispatch(removeChallengeById(id));
			}
		});
		return () => SSEService.removeListener(id);
	});
	return (
		<div className={styles.container}>
			<img src={SwordsIcon} className={styles.swords_icon} />
			<p className={styles.text}>
				{cancelled
					? `Challenge Cancelled by ${challenge.sender}`
					: `You're challenged by ${challenge.sender}`}
			</p>
			<div className={styles.buttons_wrapper}>
				{cancelled ? (
					<Button onClick={() => dispatch(popChallenge())}>Next</Button>
				) : (
					<>
						<Button onClick={onAccept}>Accept</Button>
						<Button variant="secondary" onClick={onDeny}>
							Deny
						</Button>
					</>
				)}
			</div>
		</div>
	);
};

export default Challenge;
