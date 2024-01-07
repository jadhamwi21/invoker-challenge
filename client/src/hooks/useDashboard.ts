import { useGetClientFriendsQuery } from "@/redux/apis/friends.api";
import SSEService from "@/services/SSEService";
import { useEffect, useState } from "react";

export const useDashboard = () => {
	const [subscribed, setSubscribed] = useState(false);

	useEffect(() => {
		SSEService.setup();
		setSubscribed(true);
	}, []);

	const loading = !subscribed;

	return { showOutlet: !loading };
};
