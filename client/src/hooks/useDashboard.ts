import { useGetClientFriendsQuery } from "@/redux/apis/friends.api";

export const useDashboard = () => {
	const { isLoading: friendsLoading } = useGetClientFriendsQuery();

	const loading = friendsLoading;

	return { showOutlet: !loading };
};
