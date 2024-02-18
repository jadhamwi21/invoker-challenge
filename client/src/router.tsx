import {
	Route,
	createBrowserRouter,
	createRoutesFromElements,
} from "react-router-dom";
import Friends from "./features/Friends/Friends";
import Notifications from "./features/Notifications/Notifications";
import Play from "./features/Play/Play";
import Player from "./features/Player/Player";
import Players from "./features/Players/Players";
import Playground from "./features/Playground/Playground";
import PagesTransitionWrapper from "./layouts/Transitions/PagesTransitionWrapper";
import DashboardView from "./views/Dashboard/DashboardView";
import LandingView from "./views/Landing/LandingView";
import LoginView from "./views/Login/LoginView";
import SignupView from "./views/Signup/SignupView";

export const router = createBrowserRouter(
	createRoutesFromElements(
		<Route element={<PagesTransitionWrapper />}>
			<Route path="/" element={<LandingView />} />
			<Route path="signup" element={<SignupView />} />
			<Route path="login" element={<LoginView />} />
			<Route path="dashboard" element={<DashboardView />}>
				<Route path="players" element={<Players />} />
				<Route path="players/:slug" element={<Player />} />
				<Route path="friends" element={<Friends />} />
				<Route path="playground" element={<Playground />} />
				<Route path="notifications" element={<Notifications />} />
				<Route path="play" element={<Play />} />
			</Route>
		</Route>
	)
);
