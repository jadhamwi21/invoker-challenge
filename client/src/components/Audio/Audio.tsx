import { useEffect, useRef } from "react";

type Props = { src: string; play: boolean; volume?: number };

const Audio = ({ src, play, volume = 0.3 }: Props) => {
	const ref = useRef<HTMLAudioElement>(null);
	useEffect(() => {
		if (play) {
			ref.current.play();
		}
	}, [play]);
	useEffect(() => {
		ref.current.volume = volume;
	}, []);
	return <audio src={src} ref={ref} />;
};

export default Audio;
