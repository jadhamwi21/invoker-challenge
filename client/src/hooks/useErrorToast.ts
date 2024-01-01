import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useEffect } from "react";
import { toast } from "react-toastify";

type TypedRtkError = FetchBaseQueryError & { data: { message: string } };

export const useErrorToast = (error: FetchBaseQueryError | SerializedError) => {
	useEffect(() => {
		if (error) {
			let message: string;
			if ("status" in error) {
				const _error = error as TypedRtkError;
				message = _error.data.message;
			} else {
				message = error.message;
			}
			toast.error(message);
		}
	}, [error]);
};
