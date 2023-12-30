import React from "react";
import styles from "./Loader.module.scss";
import { BarLoader } from "react-spinners";
type Props = {} & React.ComponentProps<typeof BarLoader>;

const Loader = (props: Props) => {
	return <BarLoader color="var(--blue)" {...props} />;
};

export default Loader;
