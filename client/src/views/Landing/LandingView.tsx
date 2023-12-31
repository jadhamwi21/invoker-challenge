import Playground from "@/features/Playground/Playground";
import HeadlineSection from "./views/Headline/HeadlineSection";
import PlaygroundSection from "./views/Playground/PlaygroundSection";
import ServicesSection from "./views/Services/ServicesSection";
import { motion } from "framer-motion";
import PageTransition from "@/layouts/Transitions/PageTransition";
type Props = {};

const LandingView = (props: Props) => {
	return (
		<PageTransition>
			<HeadlineSection />
			<PlaygroundSection />
			<ServicesSection />
		</PageTransition>
	);
};

export default LandingView;
