import Loader from "@/components/Loader/Loader";
import ChallengesModal from "@/features/Challenge/components/Challengers/ChallengesModal";
import Transition from "@/layouts/Transitions/Transitions";
import { AnimatePresence } from "framer-motion";
import React from "react";
import styles from "./DashboardContainer.module.scss";
import { useDashboardLoader } from "./useDashboardLoader";
type Props = { children: React.ReactNode };

const DashboardContainer = ({ children }: Props) => {
	const { loading } = useDashboardLoader();

	return (
		<AnimatePresence mode={"wait"}>
			<Transition key={Number(loading)}>
				{loading ? (
					<div className={styles.loader_container}>
						<Loader width={"100%"} />
					</div>
				) : (
					children
				)}
			</Transition>
			<ChallengesModal />
		</AnimatePresence>
	);
};

export default DashboardContainer;
