export type PlayerDetails = {
	username: string;
	firstname: string;
	lastname: string;
};

export type PlayerCredentials = {
	username: string;
	password: string;
};

export type PlayerInfo = {
	username: string;
	firstname: string;
	lastname: string;
	friends: string[];
	matches: unknown[];
};
