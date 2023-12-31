import InvokerHead from "@/assets/images/InvokerHead.png";
import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import styles from "./Login.module.scss";
import * as yup from "yup";
import { useFormik } from "formik";
type Props = {};

const schema = yup.object().shape({
	username: yup.string().required("Username is required"),
	password: yup.string().required("Password is required"),
});
const Login = (props: Props) => {
	const formik = useFormik({
		initialValues: {
			username: "",
			password: "",
		},
		validationSchema: schema,
		onSubmit: (values) => {
			console.log(values);
		},
	});
	return (
		<form className={styles.wrapper} onSubmit={formik.handleSubmit}>
			<div className={styles.header}>
				<img src={InvokerHead} />
			</div>

			<Input
				label="Username"
				id="username"
				name="username"
				value={formik.values.username}
				onChange={formik.handleChange}
				error={formik.errors.username}
			/>

			<Input
				label="Password"
				id="password"
				name="password"
				value={formik.values.password}
				onChange={formik.handleChange}
				type="password"
				error={formik.errors.password}
			/>

			<Button type="submit">Login</Button>
		</form>
	);
};

export default Login;
