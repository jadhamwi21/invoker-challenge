import InvokerHead from "@/assets/images/InvokerHead.png";
import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import { Form, useFormik } from "formik";
import * as yup from "yup";
import styles from "./Signup.module.scss";
import _ from "lodash";
import { axiosInstance } from "@/utils/utils";
import Loader from "@/components/Loader/Loader";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const schema = yup.object().shape({
	firstname: yup.string().required("First Name is required"),
	lastname: yup.string().required("Last Name is required"),
	email: yup
		.string()
		.email("Invalid email address")
		.required("Email is required"),
	username: yup.string().required("Username is required"),
	password: yup.string().required("Password is required"),
});

const Signup = () => {
	const navigate = useNavigate();
	const formik = useFormik({
		initialValues: {
			firstname: "",
			lastname: "",
			email: "",
			username: "",
			password: "",
		},
		validationSchema: schema,
		onSubmit: async (data) => {
			const signupValues = _.omit(data, ["confirmPassword"]);

			await axiosInstance
				.post("/auth/signup", signupValues)
				.then(() => {
					toast.success("Signed up");
					navigate("/login");
				})
				.catch((err) => {
					toast.error(
						err.response.data.message ||
							err.response.data ||
							"an error has occured"
					);
				});
		},
	});

	return (
		<form className={styles.wrapper} onSubmit={formik.handleSubmit}>
			<div className={styles.header}>
				<img src={InvokerHead} alt="Invoker Head" />
			</div>
			<Input
				label="First Name"
				id="firstname"
				name="firstname"
				value={formik.values.firstname}
				onChange={formik.handleChange}
				error={formik.errors.firstname}
			/>
			<Input
				label="Last Name"
				id="lastname"
				name="lastname"
				value={formik.values.lastname}
				onChange={formik.handleChange}
				error={formik.errors.lastname}
			/>
			<Input
				label="Username"
				id="username"
				name="username"
				value={formik.values.username}
				onChange={formik.handleChange}
				error={formik.errors.username}
			/>
			<Input
				label="Email"
				id="email"
				name="email"
				value={formik.values.email}
				onChange={formik.handleChange}
				error={formik.errors.email}
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
					<Button type="submit">Signup</Button>
				)}
			</div>
		</form>
	);
};

export default Signup;
