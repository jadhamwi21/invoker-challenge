import { useGetClientFriendsQuery } from "@/redux/apis/friends.api";
import { useState, useEffect } from "react";
export const useDashboardLoader = () => {
	const { isLoading: friendsLoading } = useGetClientFriendsQuery();

	const [loading, setLoading] = useState(true);
	useEffect(() => {
		const isAllLoading = [friendsLoading].every((loading) => loading);
		if (!isAllLoading) {
			setTimeout(() => {
				setLoading(false);
			}, 500);
		}
	}, [friendsLoading]);

	return { loading };
};
