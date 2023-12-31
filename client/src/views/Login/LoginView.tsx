import InvokerHead from "@/assets/images/InvokerHead.png";
import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import { useFormik } from "formik";
import * as yup from "yup";
import styles from "./LoginView.module.scss";
import Login from "@/features/Login/Login";
import PageTransition from "@/layouts/Transitions/PageTransition";

type Props = {};

const LoginView = (props: Props) => {
	return (
		<PageTransition>
			<div className={styles.container}>
				<Login />
			</div>
		</PageTransition>
	);
};

export default LoginView;
