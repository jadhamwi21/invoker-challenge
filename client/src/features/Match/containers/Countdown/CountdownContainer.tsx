import CountdownFinishAudio from "@/assets/audio/Invoker.mp3";
import Audio from "@/components/Audio/Audio";
import Modal from "@/components/Modal/Modal";
import WebsocketService, {
	CountdownMessage,
} from "@/services/WebsocketService";
import { animated, useSpring } from "@react-spring/web";
import { useEffect, useState } from "react";
import styles from "./CountdownContainer.module.scss";

type Props = {};

const CountdownContainer = (props: Props) => {
	const [countdown, setCountdown] = useState<number | null>(null);
	const [isStartup, setIsStartup] = useState(true);
	useEffect(() => {
		const cleanup = WebsocketService.addHandler(
			"countdown",
			(message: CountdownMessage) => {
				setCountdown(message.data);
			}
		);
		return cleanup;
	}, []);
	useEffect(() => {
		if (countdown === 0) {
			setIsStartup(false);
		}
	}, [countdown]);
	const [springs] = useSpring(
		() => ({
			from: { opacity: 0.5, scale: 0.7 },
			to: { opacity: 1, scale: 1 },
			reset: true,
		}),
		[countdown]
	);
	return (
		<>
			<Modal opened={Boolean(countdown)} closeBehavior="none">
				<div className={styles.wrapper}>
					<p className={styles.text}>
						{isStartup
							? `Your match is starting in`
							: `Your match is resumed in`}
					</p>
					<animated.p style={springs} className={styles.countdown}>
						{countdown}
					</animated.p>
				</div>
			</Modal>
			<Audio src={CountdownFinishAudio} play={countdown === 0} />
		</>
	);
};

export default CountdownContainer;
