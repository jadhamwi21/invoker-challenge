import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useIsFirstRender } from "usehooks-ts";

const FULLSCREEN_STYLES = `
position: fixed;
top: 0;
left: 0;
height: 100vh;
width: 100%;
zIndex: 50;
background: var(--black);
`;

export const useFullScreen = <T extends HTMLDivElement>() => {
	const [fullscreen, setFullscreen] = useState(false);
	const elementRef = useRef<T>(null);
	const fullscreenHandler = () => {
		if (!fullscreen) {
			document.body.requestFullscreen();
			document.body.focus();
		} else {
			document.exitFullscreen();
		}
	};

	const isFirstRender = useIsFirstRender();

	useLayoutEffect(() => {
		if (!isFirstRender) {
			if (elementRef.current) {
				if (fullscreen) {
					elementRef.current.setAttribute("style", FULLSCREEN_STYLES);
				} else {
					elementRef.current.removeAttribute("style");
					elementRef.current.scrollIntoView();
				}
			}
		}
	}, [fullscreen]);

	useEffect(() => {
		document.addEventListener("fullscreenchange", () => {
			setFullscreen(Boolean(document.fullscreenElement));
		});
	}, []);

	return { fullscreenHandler, fullscreen, elementRef: elementRef };
};
