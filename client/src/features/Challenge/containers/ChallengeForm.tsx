import Button from "@/components/Button/Button";
import Loader from "@/components/Loader/Loader";
import Select from "@/components/Select/Select";
import { useChallengeMutation } from "@/redux/apis/challenges.api";
import { useGetClientFriendsQuery } from "@/redux/apis/friends.api";
import {
	selectChallenge,
	setChallengeFriend,
	setPendingChallengeId,
} from "@/redux/slices/challenges.slice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { useFormik } from "formik";
import { uniqueId } from "lodash";
import * as yup from "yup";
import styles from "./ChallengeForm.module.scss";
const schema = yup.object().shape({
	friend: yup.string().required("friend is required"),
});
type Props = {};

const ChallengeForm = (props: Props) => {
	const { data, isLoading } = useGetClientFriendsQuery();
	const initialValues = useAppSelector(selectChallenge);

	const dispatch = useAppDispatch();
	const [challenge] = useChallengeMutation();
	const { isSubmitting, values, errors, setFieldValue, handleSubmit } =
		useFormik({
			initialValues,
			validationSchema: schema,
			validateOnChange: false,
			onSubmit(values, { setSubmitting }) {
				const id = uniqueId("challenge");
				challenge({ id, username: values.friend })
					.unwrap()
					.then(() => dispatch(setPendingChallengeId(id)))
					.then(() => setSubmitting(false));
			},
		});
	return (
		<form className={styles.container} onSubmit={handleSubmit}>
			{isLoading ? (
				<Loader />
			) : (
				<>
					<Select
						onChange={(val) => {
							dispatch(setChallengeFriend(val));
							setFieldValue("friend", val);
						}}
						value={values.friend}
						list={[
							{ label: "Select a friend...", value: "" },
							...data.map((friend) => ({ label: friend, value: friend })),
						]}
						label="Friend"
						error={errors.friend}
					/>
					<div className={styles.footer}>
						{isSubmitting ? (
							<Loader />
						) : (
							<Button type="submit" variant="secondary">
								Challenge!
							</Button>
						)}
					</div>
				</>
			)}
		</form>
	);
};

export default ChallengeForm;
