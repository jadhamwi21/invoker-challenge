import {
	useGetNotificationsQuery,
	useUpdateNotificationsToSeenMutation,
} from "@/redux/apis/notifications.api";
import React from "react";
import { useEffectOnce } from "usehooks-ts";

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
				<div key={notification.timestamp}>
					{notification.timestamp} - {notification.text}
				</div>
			))
	);
};

export default Notifications;
