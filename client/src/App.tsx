import { RouterProvider } from "react-router-dom";
import { router } from "./router";

type Props = {};

const App = (props: Props) => {
	return <RouterProvider router={router} />;
};

export default App;
