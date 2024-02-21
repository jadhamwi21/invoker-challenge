import Modal from "@/components/Modal/Modal";
import { selectChallenge } from "@/redux/slices/challenges.slice";
import { useAppSelector } from "@/redux/store";
import Challenge from "./Challenge";
import styles from "./ChallengesModal.module.scss";
type Props = {};

const ChallengesModal = (props: Props) => {
	const { challenges } = useAppSelector(selectChallenge);
	return (
		<Modal opened={challenges.length !== 0} closeBehavior={"none"}>
			<div className={styles.container}>
				<div>{challenges.length > 1 && `${challenges.length - 1} Left`}</div>
				{challenges.length !== 0 && <Challenge challenge={challenges[0]} />}
			</div>
		</Modal>
	);
};

export default ChallengesModal;
