import React from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

type Props = { children: React.ReactNode; transitionKey?: any };

const Transition = ({ children, transitionKey }: Props) => {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			style={{ height: "100%", width: "100%" }}
			key={transitionKey}
		>
			{children}
		</motion.div>
	);
};

export default Transition;
