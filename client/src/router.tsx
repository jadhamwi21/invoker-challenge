import { createBrowserRouter } from "react-router-dom";
import LandingView from "./views/Landing/LandingView";
import LoginView from "./views/Login/LoginView";
import SignupView from "./views/Signup/SignupView";
import DashboardView from "./views/Dashboard/DashboardView";
import Friends from "./features/Friends/Friends";
import Playground from "./features/Playground/Playground";
import Players from "./features/Players/Players";

export const router = createBrowserRouter([
	{ path: "/", element: <LandingView /> },
	{ path: "signup", element: <SignupView /> },
	{ path: "login", element: <LoginView /> },
	{
		path: "dashboard",
		element: <DashboardView />,
		children: [
			{ path: "players", element: <Players /> },
			{
				path: "friends",
				element: <Friends />,
			},
			{ path: "playground", element: <Playground /> },
		],
	},
]);
