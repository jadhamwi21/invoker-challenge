import WebsocketService from "@/services/WebsocketService";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const joinMatch = createAsyncThunk<void, string>(
	"match/join",
	async (sessionId) => {
		await WebsocketService.setup(sessionId);
	}
);
