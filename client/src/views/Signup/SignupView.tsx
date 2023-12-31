import Signup from "@/features/Signup/Signup";
import styles from "./SignupView.module.scss";
import PageTransition from "@/layouts/Transitions/PageTransition";

type Props = {};

const SignupView = (props: Props) => {
	return (
		<PageTransition>
			<div className={styles.container}>
				<Signup />
			</div>
		</PageTransition>
	);
};

export default SignupView;
