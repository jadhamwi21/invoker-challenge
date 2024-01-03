import InvokerHead from "@/assets/images/InvokerHead.png";
import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import Loader from "@/components/Loader/Loader";
import { useErrorToast } from "@/hooks/useErrorToast";
import { useLoginPlayerMutation } from "@/redux/apis/auth.api";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import styles from "./Login.module.scss";

type Props = {};

const schema = yup.object().shape({
	username: yup.string().required("Username is required"),
	password: yup.string().required("Password is required"),
});
const Login = (props: Props) => {
	const navigate = useNavigate();
	const [login, { error }] = useLoginPlayerMutation();
	const formik = useFormik({
		initialValues: {
			username: "",
			password: "",
		},
		validationSchema: schema,
		onSubmit: async (values) => {
			try {
				await login(values).unwrap();
				navigate("/dashboard");
			} catch (e) {
				console.log(e);
			}
		},
	});
	useErrorToast(error);

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
			<div className={styles.footer}>
				{formik.isSubmitting ? (
					<Loader />
				) : (
					<Button type="submit">Login</Button>
				)}
			</div>
		</form>
	);
};

export default Login;
