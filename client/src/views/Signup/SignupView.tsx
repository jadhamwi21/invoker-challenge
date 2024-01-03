import Signup from "@/features/Signup/Signup";
import styles from "./SignupView.module.scss";
import Transition from "@/layouts/Transitions/Transitions";

type Props = {};

const SignupView = (props: Props) => {
	return (
		<Transition>
			<div className={styles.container}>
				<Signup />
			</div>
		</Transition>
	);
};

export default SignupView;
