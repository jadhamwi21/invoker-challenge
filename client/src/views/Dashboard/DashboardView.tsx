import SideBar from "@/layouts/SideBar/SideBar";
import React from "react";
import styles from "./DashboardView.module.scss";
import { Outlet } from "react-router-dom";
import PageTransition from "@/layouts/Transitions/PageTransition";

type Props = {};

const DashboardView = (props: Props) => {
	return (
		<PageTransition>
			<div className={styles.container}>
				<SideBar />
				<div className={styles.outlet}>
					<Outlet />
				</div>
			</div>
		</PageTransition>
	);
};

export default DashboardView;
