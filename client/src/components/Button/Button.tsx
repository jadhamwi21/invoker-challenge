import React from "react";
import styles from "./Button.module.scss";
type ButtonType = "primary" | "secondary";

type Props = {
	variant?: ButtonType;
	children: React.ReactNode;
} & React.DetailedHTMLProps<
	React.ButtonHTMLAttributes<HTMLButtonElement>,
	HTMLButtonElement
>;

const Button = ({ variant = "primary", children, ...other }: Props) => {
	const classes = [styles[variant], styles.button].join(" ");
	return (
		<button className={classes} {...other}>
			{children}
		</button>
	);
};

export default Button;
