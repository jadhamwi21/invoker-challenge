import HappinesIcon from "@/assets/images/happiness.png";
import Loader from "@/components/Loader/Loader";
import { selectMatchMake } from "@/redux/slices/matchmake.slice";
import { useAppSelector } from "@/redux/store";
import styles from "./PendingAcceptModal.module.scss";
type Props = {};

const PendingAcceptModal = (props: Props) => {
	const { friend } = useAppSelector(selectMatchMake);
	return (
		<div className={styles.container}>
			<img src={HappinesIcon} className={styles.icon} />
			<p>Waiting for {friend} to accept the challenge...</p>
			<div className={styles.loader_wrapper}>
				<Loader />
			</div>
		</div>
	);
};

export default PendingAcceptModal;
