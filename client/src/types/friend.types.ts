export type FriendStatusType =
	| "friend"
	| "not-friend"
	| "pending-your-response"
	| "pending-his-response";

export type FriendStatusResponse =
	| { status: "friend" }
	| { status: "not-friend" }
	| { status: "pending-your-response"; requestId: string }
	| { status: "pending-his-response"; requestId: string };
