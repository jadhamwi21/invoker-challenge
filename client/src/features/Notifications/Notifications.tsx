import {
	useGetNotificationsQuery,
	useUpdateNotificationsToSeenMutation,
} from "@/redux/apis/notifications.api";
import { useEffectOnce } from "usehooks-ts";
import NotificationItem from "./components/Item/NotificationItem";

type Props = {};

const Notifications = (props: Props) => {
	const { data, isLoading } = useGetNotificationsQuery();
	const [updateNotificationsToSeen] = useUpdateNotificationsToSeenMutation();
	useEffectOnce(() => {
		updateNotificationsToSeen();
	});
	return isLoading ? (
		<div>Loading...</div>
	) : (
		[...data]
			.sort((a, b) => b.timestamp.localeCompare(a.timestamp))
			.map((notification) => (
				<NotificationItem
					notification={notification}
					key={notification.timestamp}
				/>
			))
	);
};

export default Notifications;
