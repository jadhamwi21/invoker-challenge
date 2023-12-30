import SideBar from "@/layouts/SideBar/SideBar";
import React from "react";
import styles from "./DashboardView.module.scss";
import { Outlet } from "react-router-dom";

type Props = {};

const DashboardView = (props: Props) => {
	return (
		<div className={styles.container}>
			<SideBar />
			<div className={styles.outlet}>
				<Outlet />
			</div>
		</div>
	);
};

export default DashboardView;
