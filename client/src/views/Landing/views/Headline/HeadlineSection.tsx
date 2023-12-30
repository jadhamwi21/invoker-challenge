import InvokerPortraitContainer from "@/containers/InvokerPortrait/InvokerPortraitContainer";
import { EnOrb } from "@/types/invoker.types";
import { animated, useSpring } from "@react-spring/web";
import styles from "./Headline.module.scss";
import Button from "@/components/Button/Button";
import { useNavigate } from "react-router-dom";
type Props = {};

const HeadlineSection = (props: Props) => {
	const headerSprings = useSpring({
		from: { opacity: 0, x: -50 },
		to: { opacity: 1, x: 0 },
	});
	const contentSprings = useSpring({
		from: { opacity: 0, y: 50 },
		to: { opacity: 1, y: 0 },
	});

	const buttonsSprings = useSpring({
		from: { opacity: 0, y: 50 },
		to: { opacity: 1, y: 0 },
	});
	const navigate = useNavigate();

	return (
		<section className={styles.wrapper}>
			<div className={styles.container}>
				<animated.h1 className={styles.header} style={headerSprings}>
					Challenge Your Fellows
				</animated.h1>
				<animated.p className={styles.content} style={contentSprings}>
					Unleash the Mystic Arts, Master the Elements, and Rise to the Invoker
					Challenge
				</animated.p>
				<animated.div className={styles.buttons} style={buttonsSprings}>
					<Button variant="secondary" onClick={() => navigate("/signup")}>
						Get Started
					</Button>
					<Button onClick={() => navigate("/login")}>Start Challenging</Button>
				</animated.div>
			</div>
			<InvokerPortraitContainer orbs={[EnOrb.QUAS, EnOrb.WEX, EnOrb.EXORT]} />
		</section>
	);
};

export default HeadlineSection;
