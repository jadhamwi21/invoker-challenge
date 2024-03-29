import { NUMBER_REGEX } from "@/constants/constants";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import styles from "./Input.module.scss";
type Props = {
	label?: string;
	wrapperStyles?: React.CSSProperties;
	error?: string;
	icon?: React.ReactNode;
	iconOnClick?: () => void;
	numbers?: boolean;
} & React.DetailedHTMLProps<
	React.InputHTMLAttributes<HTMLInputElement>,
	HTMLInputElement
>;

const Input = ({
	label,
	wrapperStyles,
	error,
	icon,
	iconOnClick,
	numbers = false,
	...other
}: Props) => {
	const [type, setType] = useState(other.type);
	const [focused, setFocused] = useState(false);

	const onFocus = () => setFocused(true);
	const onBlur = () => setFocused(false);

	return (
		<div className={styles.container}>
			{label && <p className={styles.label}>{label}</p>}
			<div
				className={
					focused ? [styles.wrapper, styles.focused].join(" ") : styles.wrapper
				}
				style={wrapperStyles}
			>
				<input
					className={styles.input}
					{...other}
					onChange={(e) => {
						if (numbers) {
							if (e.target.value === "" || NUMBER_REGEX.test(e.target.value)) {
								other.onChange(e);
							}
						} else {
							other.onChange(e);
						}
					}}
					type={type}
					autoComplete="off"
					onFocus={onFocus}
					onBlur={onBlur}
				/>
				{other.type === "password" && (
					<div
						className={styles.icon}
						onClick={() =>
							setType((prev) => (prev === "text" ? "password" : "text"))
						}
					>
						{type === "password" ? (
							<FontAwesomeIcon icon={faEye} size="xs" />
						) : (
							<FontAwesomeIcon icon={faEyeSlash} size="xs" />
						)}
					</div>
				)}
				{icon && (
					<div className={styles.icon} onClick={iconOnClick}>
						{icon}
					</div>
				)}
			</div>
			{error && <div className={styles.error}>{error}</div>}
		</div>
	);
};

export default Input;
