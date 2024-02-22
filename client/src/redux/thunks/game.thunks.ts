import WebsocketService from "@/services/WebsocketService";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const joinGame = createAsyncThunk<void, string>(
	"game/join",
	async (sessionId) => {
		await WebsocketService.setup(sessionId);
	}
);
