import { useDashboard } from "@/hooks/useDashboard";
import SSEService from "@/services/SSEService";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
export const useDashboardLoader = () => {
	const { showOutlet } = useDashboard();
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		if (showOutlet) {
			SSEService.addListener("notification", (data: string) => {
				toast.success(data);
			});
			setTimeout(() => {
				setLoading(false);
			}, 500);
		}
	}, [showOutlet]);

	return { loading };
};
