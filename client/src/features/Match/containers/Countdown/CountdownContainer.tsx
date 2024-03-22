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
	const [countdown, setCountdown] = useState<{
		message: string;
		countdown: number;
	} | null>(null);

	useEffect(() => {
		const cleanup = WebsocketService.addHandler(
			"countdown",
			(message: CountdownMessage) => {
				setCountdown({
					countdown: message.data.countdown,
					message: message.data.launch
						? "Game is starting in"
						: "Game is resumed in",
				});
			}
		);
		return cleanup;
	}, []);
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
			<Modal
				opened={Boolean(countdown) && countdown.countdown !== 0}
				closeBehavior="none"
			>
				{countdown && (
					<div className={styles.wrapper}>
						<p className={styles.text}>{countdown.message}</p>
						<animated.p style={springs} className={styles.countdown}>
							{countdown.countdown}
						</animated.p>
					</div>
				)}
			</Modal>
			{countdown && (
				<Audio src={CountdownFinishAudio} play={countdown.countdown === 0} />
			)}
		</>
	);
};

export default CountdownContainer;
