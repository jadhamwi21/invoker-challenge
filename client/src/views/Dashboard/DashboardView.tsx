import DashboardContainer from "@/containers/Dashboard/DashboardContainer";
import SideBar from "@/layouts/SideBar/SideBar";
import Transition from "@/layouts/Transitions/Transitions";
import { Outlet, useLocation } from "react-router-dom";
import styles from "./DashboardView.module.scss";

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
