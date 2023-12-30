import React from "react";
import styles from "./ProfileItem.module.scss";
import InvokerHead from "@/assets/images/InvokerHead.png";
type Props = { name: string };

const Profile = ({ name }: Props) => {
	return (
		<div className={styles.profile}>
			<img src={InvokerHead} />

			<div>{name}</div>
		</div>
	);
};

export default Profile;
