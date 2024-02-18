import React, { useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";
import styles from "./Select.module.scss";

type SelectListType<T> = { label: string; value: T }[];

type Props<T> = {
	label?: string;
	style?: React.CSSProperties;
	error?: string;
	value: T;
	list: SelectListType<T>;
	onChange: (val: T) => void;
};

const Select = <T extends string | number>({
	label,
	style,
	value,
	list,
	error,
	onChange,
}: Props<T>) => {
	const [focused, setFocused] = useState(false);
	const ref = useRef<HTMLDivElement>();
	const displayValue = list.find((cur) => cur.value === value).label;
	const containerRef = useRef<HTMLDivElement>();
	useOnClickOutside(containerRef, () => setFocused(false));
	return (
		<div className={styles.container} style={style} ref={containerRef}>
			{label && <p className={styles.label}>{label}</p>}
			<div
				ref={ref}
				tabIndex={0}
				onFocus={() => setFocused(true)}
				className={styles.wrapper}
			>
				{displayValue}
			</div>
			{focused && (
				<ul className={styles.list}>
					{list.map((current) => (
						<li
							className={current.value === value ? styles.selected_item : ""}
							key={current.label}
							onClick={() => {
								onChange(current.value);
								setFocused(false);
							}}
						>
							{current.label}
						</li>
					))}
				</ul>
			)}
			{error && <div className={styles.error}>{error}</div>}
		</div>
	);
};

export default Select;
