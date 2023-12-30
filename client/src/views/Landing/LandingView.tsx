import Playground from "@/features/Playground/Playground";
import HeadlineSection from "./views/Headline/HeadlineSection";
import PlaygroundSection from "./views/Playground/PlaygroundSection";
import ServicesSection from "./views/Services/ServicesSection";
type Props = {};

const LandingView = (props: Props) => {
	return (
		<>
			<HeadlineSection />
			<PlaygroundSection />
			<ServicesSection />
		</>
	);
};

export default LandingView;
