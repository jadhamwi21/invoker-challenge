import { useDashboard } from "@/hooks/useDashboard";
import { useGetClientFriendsQuery } from "@/redux/apis/friends.api";
import { useState, useEffect } from "react";
export const useDashboardLoader = () => {
	const { showOutlet } = useDashboard();
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		if (showOutlet) {
			setTimeout(() => {
				setLoading(false);
			}, 500);
		}
	}, [showOutlet]);

	return { loading };
};
