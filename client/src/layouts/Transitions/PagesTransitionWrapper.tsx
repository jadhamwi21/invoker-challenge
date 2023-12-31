import { AnimatePresence } from "framer-motion";
import React from "react";
import { Outlet, useLocation } from "react-router-dom";

type Props = {};

const PagesTransitionWrapper = (props: Props) => {
	return (
		<AnimatePresence>
			<Outlet />
		</AnimatePresence>
	);
};

export default PagesTransitionWrapper;
