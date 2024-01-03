import SideBar from "@/layouts/SideBar/SideBar";
import React from "react";
import styles from "./DashboardView.module.scss";
import { Outlet, useLocation } from "react-router-dom";
import Transition from "@/layouts/Transitions/Transitions";
import { useDashboard } from "@/hooks/useDashboard";
import Loader from "@/components/Loader/Loader";
import DashboardContainer from "@/containers/Dashboard/DashboardContainer";

type Props = {};

const DashboardView = (props: Props) => {
	const { key } = useLocation();

	return (
		<Transition>
			<div className={styles.container}>
				<SideBar />
				<div className={styles.outlet}>
					<DashboardContainer>
						<Transition transitionKey={key}>
							<Outlet />
						</Transition>
					</DashboardContainer>
				</div>
			</div>
		</Transition>
	);
};

export default DashboardView;
