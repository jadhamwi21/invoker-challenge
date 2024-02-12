import { useDashboard } from "@/hooks/useDashboard";
import SSEService from "@/services/SSEService";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
export const useDashboardLoader = () => {
	const { showOutlet } = useDashboard();
	const [loading, setLoading] = useState(true);
	const isListening = useRef(false);
	useEffect(() => {
		if (showOutlet && !isListening.current) {
			SSEService.addListener("notification", (data: string) => {
				toast.success(data);
			});
			setTimeout(() => {
				setLoading(false);
			}, 500);
			isListening.current = true;
		}
	}, [showOutlet]);

	return { loading };
};
