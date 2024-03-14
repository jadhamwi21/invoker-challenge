export type PlayerDetails = {
	username: string;
	firstname: string;
	lastname: string;
	token: string;
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

export type PlayerState = {
	current_spell: number;
	invoked_spells: number[];
	last_spell: number;
	score: number;
	orbs: number[];
}