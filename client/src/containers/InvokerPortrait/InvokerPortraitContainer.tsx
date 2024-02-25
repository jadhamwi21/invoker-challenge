import InvokerBody from "@/assets/images/InvokerBody.png";
import { ORB_TO_ICON_MAP } from "@/constants/constants";
import { EnOrb } from "@/types/invoker.types";
import { animated, useSpring } from "@react-spring/web";
import { useRef } from "react";
import {
	getInvokerPortraitClasses,
	shouldAnimateOrbs,
} from "./InvokerPortrait.helper";
import styles from "./InvokerPortrait.module.scss";

type OrbsType = EnOrb[];

type Props = {
	orbs: OrbsType;
	animate?: boolean;
};

const ORB_OFFSET = -20;

const InvokerPortraitContainer = ({ orbs, animate = true }: Props) => {
	const initialOrbs = useRef(orbs);
	const [leftOrb, middleOrb, rightOrb] = orbs;
	const [
		leftOrbClasses,
		middleOrbClasses,
		rightOrbClasses,
		invokerBodyClasses,
	] = getInvokerPortraitClasses();

	const leftOrbSprings = useSpring({
		from: { opacity: 0, y: -100, x: ORB_OFFSET },
		to: { opacity: 1, y: 0 },
		delay: 200,
	});

	const middleOrbSprings = useSpring({
		from: { opacity: 0, y: -100, x: ORB_OFFSET },
		to: { opacity: 1, y: 0 },
		delay: 400,
	});
	const rightOrbSprings = useSpring({
		from: { opacity: 0, y: -100, x: ORB_OFFSET },
		to: { opacity: 1, y: 0 },
		delay: 600,
	});

	const invokerBodySprings = useSpring({
		from: {
			opacity: 0,
			scale: 0.75,
		},
		to: {
			opacity: 1,
			scale: 1,
		},
	});
	return (
		<div className={styles.container}>
			<animated.img
				style={animate ? invokerBodySprings : {}}
				src={InvokerBody}
				className={invokerBodyClasses}
			/>
			<div>
				<animated.img
					style={
						shouldAnimateOrbs(animate, initialOrbs.current)
							? leftOrbSprings
							: {}
					}
					src={ORB_TO_ICON_MAP[leftOrb]}
					className={leftOrbClasses}
				/>
				<animated.img
					src={ORB_TO_ICON_MAP[middleOrb]}
					className={middleOrbClasses}
					style={
						shouldAnimateOrbs(animate, initialOrbs.current)
							? middleOrbSprings
							: {}
					}
				/>
				<animated.img
					style={
						shouldAnimateOrbs(animate, initialOrbs.current)
							? rightOrbSprings
							: {}
					}
					src={ORB_TO_ICON_MAP[rightOrb]}
					className={rightOrbClasses}
				/>
			</div>
		</div>
	);
};

export default InvokerPortraitContainer;
