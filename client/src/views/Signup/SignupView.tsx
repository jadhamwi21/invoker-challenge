import React, { useState } from "react";
import styles from "./SignupView.module.scss";
import InvokerHead from "@/assets/images/InvokerHead.png";
import Input from "@/components/Input/Input";
import { useFormik } from "formik";
import Button from "@/components/Button/Button";
import * as yup from "yup";

const schema = yup.object().shape({
	firstName: yup.string().required("First Name is required"),
	lastName: yup.string().required("Last Name is required"),
	email: yup
		.string()
		.email("Invalid email address")
		.required("Email is required"),
	username: yup.string().required("Username is required"),
	password: yup.string().required("Password is required"),
	confirmPassword: yup
		.string()
		.required("Confirm Password is required")
		.test("passwords-match", "Passwords must match", function (value) {
			return this.parent.password === value;
		}),
});

type Props = {};

const SignupView = (props: Props) => {
	const formik = useFormik({
		initialValues: {
			firstName: "",
			lastName: "",
			email: "",
			username: "",
			password: "",
			confirmPassword: "",
		},
		validationSchema: schema,
		onSubmit: (values) => {
			console.log(values);
		},
	});
	return (
		<div className={styles.container}>
			<form className={styles.wrapper} onSubmit={formik.handleSubmit}>
				<div className={styles.header}>
					<img src={InvokerHead} />
				</div>
				<Input
					label="First Name"
					id="firstName"
					name="firstName"
					value={formik.values.firstName}
					onChange={formik.handleChange}
					error={formik.errors.firstName}
				/>
				<Input
					label="Last Name"
					id="lastName"
					name="lastName"
					value={formik.values.lastName}
					onChange={formik.handleChange}
					error={formik.errors.lastName}
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
				<Button type="submit">Signup</Button>
			</form>
		</div>
	);
};

export default SignupView;
