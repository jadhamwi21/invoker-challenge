import Button from "@/components/Button/Button";
import Keys from "@/components/Keys/Keys";
import Spell from "@/components/Spell/Spell";
import InvokerPortraitContainer from "@/containers/InvokerPortrait/InvokerPortraitContainer";
import { useFullScreen } from "@/hooks/useFullscreen";
import {
	faArrowRotateLeft,
	faBook,
	faCompress,
} from "@fortawesome/free-solid-svg-icons";
import { faExpand } from "@fortawesome/free-solid-svg-icons/faExpand";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./Playground.module.scss";
import { usePlayground } from "./hooks/usePlayground";
import Spells from "@/components/Spells/Spells";
import { useState } from "react";
import PageTransition from "@/layouts/Transitions/PageTransition";

type Props = {};

const Playground = (props: Props) => {
	const { spell, orbs, counter, resetHandler } = usePlayground();
	const { fullscreen, fullscreenHandler, elementRef } = useFullScreen();
	const [showSpells, setShowSpells] = useState(false);
	const showSpellsHandler = () => {
		setShowSpells((prev) => !prev);
	};
	return (
		<PageTransition>
			<div className={styles.container} ref={elementRef}>
				<div
					className={styles.panel}
					style={{
						height: showSpells ? (fullscreen ? "100vh" : "500px") : "125px",
					}}
				>
					<div>
						Invoked : {counter} {counter === 1 ? "Spell" : "Spells"}
					</div>
					<div>
						<Button variant="secondary" onClick={resetHandler} title="Reset">
							<FontAwesomeIcon icon={faArrowRotateLeft} />
						</Button>
						<Button
							variant="secondary"
							onClick={fullscreenHandler}
							title={fullscreen ? "Exit Fullscreen" : "Enter Full Screen"}
						>
							<FontAwesomeIcon icon={fullscreen ? faCompress : faExpand} />
						</Button>
						<Button
							variant="secondary"
							title="Spells"
							onClick={showSpellsHandler}
						>
							<FontAwesomeIcon icon={faBook} />
						</Button>
					</div>
					{showSpells && <Spells />}
				</div>
				<InvokerPortraitContainer orbs={orbs} />
				<Spell spell={spell} />
				<Keys />
			</div>
		</PageTransition>
	);
};

export default Playground;
