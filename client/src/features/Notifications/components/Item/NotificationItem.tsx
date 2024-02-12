import { NotificationType } from "@/types/notifications.types";
import moment from "moment";
import styles from "./NotificationItem.module.scss";
type Props = { notification: NotificationType };

const NotificationItem = ({ notification }: Props) => {
	return (
		<div className={styles.container}>
			<div className={styles.badge}>
				{moment(notification.timestamp).format("YYYY-MM-DD hh:mm A")}
			</div>
			{notification.timestamp} - {notification.text}
		</div>
	);
};

export default NotificationItem;
