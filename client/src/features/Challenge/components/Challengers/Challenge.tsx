import SwordsIcon from "@/assets/icons/swords.svg";
import Button from "@/components/Button/Button";
import {
	useAcceptChallengeMutation,
	useDenyChallengeMutation,
} from "@/redux/apis/challenges.api";
import type { Challenge } from "@/types/challenges.types";
import styles from "./Challenge.module.scss";
type Props = { challenge: Challenge };
const Challenge = ({ challenge }: Props) => {
	const [acceptChallenge] = useAcceptChallengeMutation();
	const [denyChallenge] = useDenyChallengeMutation();
	const onDeny = () => {
		denyChallenge(challenge.id);
	};
	const onAccept = () => {
		acceptChallenge(challenge.id);
	};
	return (
		<div className={styles.container}>
			<img src={SwordsIcon} className={styles.swords_icon} />
			<p className={styles.text}>You're challenged by {challenge.sender}</p>
			<div className={styles.buttons_wrapper}>
				<Button onClick={onAccept}>Accept</Button>
				<Button variant="secondary" onClick={onDeny}>
					Deny
				</Button>
			</div>
		</div>
	);
};

export default Challenge;
