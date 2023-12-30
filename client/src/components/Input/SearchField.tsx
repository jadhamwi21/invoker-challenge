import Input from "@/components/Input/Input";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ComponentProps } from "react";
import styles from "./SearchField.module.scss";
import Loader from "../Loader/Loader";
import { useMeasure } from "@uidotdev/usehooks";
type Props = { searching?: boolean } & ComponentProps<typeof Input>;

const SearchField = (props: Props) => {
	const [ref, { width }] = useMeasure();
	return (
		<div className={styles.wrapper} ref={ref}>
			<Input
				icon={<FontAwesomeIcon icon={faSearch} />}
				placeholder={props.placeholder}
				disabled={props.searching}
				{...props}
			/>
			<div className={styles.loader_wrapper}>
				{props.searching && <Loader width={width! - 40} />}
			</div>
		</div>
	);
};

export default SearchField;
