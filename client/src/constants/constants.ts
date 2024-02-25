import AlacrityIcon from "@/assets/images/Alacrity.png";
import ChaosMeteorIcon from "@/assets/images/Chaos Meteor.png";
import ColdSnapIcon from "@/assets/images/Cold Snap.png";
import DeafeningBlastIcon from "@/assets/images/Deafening Blast.png";
import EmpIcon from "@/assets/images/EMP.png";
import ExortIcon from "@/assets/images/Exort.png";
import ExortOriginalIcon from "@/assets/images/Exort_icon.png";
import ForgeSpiritIcon from "@/assets/images/Forge Spirit.png";
import GhostWalkIcon from "@/assets/images/Ghost Walk.png";
import IceWallIcon from "@/assets/images/Ice Wall.png";
import InvokeIcon from "@/assets/images/Invoke.png";
import QuasIcon from "@/assets/images/Quas.png";
import QuasOriginalIcon from "@/assets/images/Quas_icon.png";
import SunStrikeIcon from "@/assets/images/SunStrike.png";
import TornadoIcon from "@/assets/images/Tornado.png";
import WexIcon from "@/assets/images/Wex.png";
import WexOriginalIcon from "@/assets/images/Wex_icon.png";
import {
	EnOrb,
	EnSpell,
	InvokationKeysType,
	OrbKeyType,
} from "@/types/invoker.types";

export const ORB_KEYS: OrbKeyType[] = ["Q", "W", "E"];
export const INVOKATION_KEYS: InvokationKeysType[] = ["Q", "W", "E", "R"];

export const ORB_TO_ICON_MAP: Record<EnOrb, string> = {
	[EnOrb.QUAS]: QuasIcon,
	[EnOrb.WEX]: WexIcon,
	[EnOrb.EXORT]: ExortIcon,
};

export const KEY_TO_ICON_MAP: Record<InvokationKeysType, string> = {
	Q: QuasOriginalIcon,
	W: WexOriginalIcon,
	E: ExortOriginalIcon,
	R: InvokeIcon,
};

export const KEY_TO_ORB_MAP: Record<OrbKeyType, EnOrb> = {
	Q: EnOrb.QUAS,
	W: EnOrb.WEX,
	E: EnOrb.EXORT,
};

export const SPELL_TO_ICON_MAP: Record<EnSpell, string> = {
	[EnSpell.COLD_SNAP]: ColdSnapIcon,
	[EnSpell.GHOST_WALK]: GhostWalkIcon,
	[EnSpell.ICE_WALL]: IceWallIcon,
	[EnSpell.TORNADO]: TornadoIcon,
	[EnSpell.EMP]: EmpIcon,
	[EnSpell.ALACRITY]: AlacrityIcon,
	[EnSpell.FORGE_SPIRIT]: ForgeSpiritIcon,
	[EnSpell.CHAOS_METEOR]: ChaosMeteorIcon,
	[EnSpell.SUN_STRIKE]: SunStrikeIcon,
	[EnSpell.DEAFENING_BLAST]: DeafeningBlastIcon,
};

export const SPELL_TO_NAME_MAP: Record<EnSpell, string> = {
	[EnSpell.COLD_SNAP]: "Cold Snap",
	[EnSpell.GHOST_WALK]: "Ghost Walk",
	[EnSpell.ICE_WALL]: "Ice Wall",
	[EnSpell.TORNADO]: "Tornado",
	[EnSpell.EMP]: "EMP",
	[EnSpell.ALACRITY]: "Alacrity",
	[EnSpell.FORGE_SPIRIT]: "Forge Spirit",
	[EnSpell.CHAOS_METEOR]: "Chaos Meteor",
	[EnSpell.SUN_STRIKE]: "Sun Strike",
	[EnSpell.DEAFENING_BLAST]: "Deafening Blast",
};

export const SPELLS_ORB_COMBINATION: Record<EnSpell, EnOrb[]> = {
	[EnSpell.COLD_SNAP]: [EnOrb.QUAS, EnOrb.QUAS, EnOrb.QUAS],
	[EnSpell.GHOST_WALK]: [EnOrb.QUAS, EnOrb.QUAS, EnOrb.WEX],
	[EnSpell.ICE_WALL]: [EnOrb.QUAS, EnOrb.QUAS, EnOrb.EXORT],
	[EnSpell.EMP]: [EnOrb.WEX, EnOrb.WEX, EnOrb.WEX],
	[EnSpell.TORNADO]: [EnOrb.WEX, EnOrb.WEX, EnOrb.QUAS],
	[EnSpell.ALACRITY]: [EnOrb.WEX, EnOrb.WEX, EnOrb.EXORT],
	[EnSpell.SUN_STRIKE]: [EnOrb.EXORT, EnOrb.EXORT, EnOrb.EXORT],
	[EnSpell.FORGE_SPIRIT]: [EnOrb.EXORT, EnOrb.EXORT, EnOrb.QUAS],
	[EnSpell.CHAOS_METEOR]: [EnOrb.EXORT, EnOrb.EXORT, EnOrb.WEX],
	[EnSpell.DEAFENING_BLAST]: [EnOrb.QUAS, EnOrb.WEX, EnOrb.EXORT],
};

export const SPELLS: EnSpell[] = [
	EnSpell.GHOST_WALK,
	EnSpell.ICE_WALL,
	EnSpell.COLD_SNAP,
	EnSpell.TORNADO,
	EnSpell.ALACRITY,
	EnSpell.EMP,
	EnSpell.FORGE_SPIRIT,
	EnSpell.CHAOS_METEOR,
	EnSpell.SUN_STRIKE,
	EnSpell.DEAFENING_BLAST,
];

export const NUMBER_REGEX = /^-?\d*\.?\d*$/;
