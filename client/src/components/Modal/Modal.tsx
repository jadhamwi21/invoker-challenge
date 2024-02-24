import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef } from "react";
import { useOnClickOutside } from "usehooks-ts";
import styles from "./Modal.module.scss";

type CloseBehavior = "on-click-outside" | "on-x" | "none";

type Props = {
	children: React.ReactNode;
	opened: boolean;
	closeBehavior?: CloseBehavior;
	closeHandler?: () => void;
};

const Modal = ({
	children,
	opened,
	closeBehavior = "on-click-outside",
	closeHandler,
}: Props) => {
	const classes = (
		opened ? [styles.container, styles.opened] : [styles.container]
	).join(" ");
	const ref = useRef<HTMLDivElement>();
	useOnClickOutside(ref, () => {
		if (closeBehavior === "on-click-outside") {
			closeHandler();
		}
	});
	return (
		opened && (
			<div className={classes}>
				<div className={styles.children} ref={ref}>
					{closeBehavior === "on-x" && (
						<div className={styles.close_wrapper}>
							<FontAwesomeIcon icon={faClose} />
						</div>
					)}
					{children}
				</div>
			</div>
		)
	);
};

export default Modal;
