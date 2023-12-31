import React from "react";
import { motion } from "framer-motion";

type Props = { children: React.ReactNode };

const PageTransition = ({ children }: Props) => {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			style={{ height: "100%", width: "100%" }}
		>
			{children}
		</motion.div>
	);
};

export default PageTransition;
