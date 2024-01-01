import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { store } from "./redux/store";
import { router } from "./router";
type Props = {};

const App = (props: Props) => {
	return (
		<Provider store={store}>
			<RouterProvider router={router} />
			<ToastContainer
				position="top-right"
				theme="dark"
				autoClose={2000}
				hideProgressBar
				closeButton={false}
			/>
		</Provider>
	);
};

export default App;
