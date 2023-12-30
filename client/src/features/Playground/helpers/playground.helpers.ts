import { INVOKATION_KEYS, ORB_KEYS } from "@/constants/constants";
import { InvokationKeysType, OrbKeyType } from "@/types/invoker.types";
import _ from "lodash";

export const isOrbKey = (key: string): key is OrbKeyType => {
	return _.includes(ORB_KEYS, key.toUpperCase());
};
export const isInvokationKey = (key: string): key is InvokationKeysType => {
	return _.includes(INVOKATION_KEYS, key.toUpperCase());
};
export const isInvokeKey = (key: string): key is "R" => {
	return key.toUpperCase() === "R";
};
