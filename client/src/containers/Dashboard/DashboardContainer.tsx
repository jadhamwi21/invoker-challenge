import React from "react";
import { useDashboardLoader } from "./useDashboardLoader";
import styles from "./DashboardContainer.module.scss";
import Loader from "@/components/Loader/Loader";
import Transition from "@/layouts/Transitions/Transitions";
import { AnimatePresence } from "framer-motion";
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
		</AnimatePresence>
	);
};

export default DashboardContainer;
