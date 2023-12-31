import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { ToastContainer } from "react-toastify";
import { AnimatePresence } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";
type Props = {};

const App = (props: Props) => {
	return (
		<>
			<RouterProvider router={router} />
			<ToastContainer
				position="top-right"
				theme="dark"
				autoClose={2000}
				hideProgressBar
				closeButton={false}
			/>
		</>
	);
};

export default App;
