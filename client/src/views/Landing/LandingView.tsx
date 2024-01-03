import Playground from "@/features/Playground/Playground";
import HeadlineSection from "./views/Headline/HeadlineSection";
import PlaygroundSection from "./views/Playground/PlaygroundSection";
import ServicesSection from "./views/Services/ServicesSection";
import { motion } from "framer-motion";
import Transition from "@/layouts/Transitions/Transitions";
type Props = {};

const LandingView = (props: Props) => {
	return (
		<Transition>
			<HeadlineSection />
			<PlaygroundSection />
			<ServicesSection />
		</Transition>
	);
};

export default LandingView;
