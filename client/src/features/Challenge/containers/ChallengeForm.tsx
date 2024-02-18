import Button from "@/components/Button/Button";
import Loader from "@/components/Loader/Loader";
import Select from "@/components/Select/Select";
import { useGetClientFriendsQuery } from "@/redux/apis/friends.api";
import { useChallengeFriendMutation } from "@/redux/apis/matchmake.api";
import {
	selectMatchMake,
	setMatchMakeFriend,
} from "@/redux/slices/matchmake.slice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { useFormik } from "formik";
import * as yup from "yup";
import styles from "./ChallengeForm.module.scss";
const schema = yup.object().shape({
	friend: yup.string().required("friend is required"),
});
type Props = {};

const ChallengeForm = (props: Props) => {
	const { data, isLoading } = useGetClientFriendsQuery();
	const initialValues = useAppSelector(selectMatchMake);

	const dispatch = useAppDispatch();
	const [challengeFriend] = useChallengeFriendMutation();
	const { isSubmitting, values, errors, setFieldValue, handleSubmit } =
		useFormik({
			initialValues,
			validationSchema: schema,
			validateOnChange: false,
			onSubmit(values, { setSubmitting }) {
				challengeFriend(values.friend)
					.unwrap()
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
							dispatch(setMatchMakeFriend(val));
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
