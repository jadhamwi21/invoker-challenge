import { AnimatePresence } from "framer-motion";
import { Outlet } from "react-router-dom";

type Props = {};

const PagesTransitionWrapper = (props: Props) => {
	return (
		<AnimatePresence mode="wait">
			<Outlet />
		</AnimatePresence>
	);
};

export default PagesTransitionWrapper;
