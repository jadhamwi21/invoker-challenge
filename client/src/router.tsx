import {
	Outlet,
	Route,
	createBrowserRouter,
	createRoutesFromElements,
} from "react-router-dom";
import LandingView from "./views/Landing/LandingView";
import LoginView from "./views/Login/LoginView";
import SignupView from "./views/Signup/SignupView";
import DashboardView from "./views/Dashboard/DashboardView";
import Friends from "./features/Friends/Friends";
import Playground from "./features/Playground/Playground";
import Players from "./features/Players/Players";
import { motion, AnimatePresence } from "framer-motion";
import PagesTransitionWrapper from "./layouts/Transitions/PagesTransitionWrapper";
import Player from "./features/Player/Player";
import Notifications from "./features/Notifications/Notifications";

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
			</Route>
		</Route>
	)
);
