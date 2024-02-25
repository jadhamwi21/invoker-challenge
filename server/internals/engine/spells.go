package engine

// Orbs
const (
	QUAS = iota
	WEX
	EXORT
)

// Spells
const (
	COLD_SNAP = iota
	GHOST_WALK
	ICE_WALL
	TORNADO
	EMP
	ALACRITY
	FORGE_SPIRIT
	CHAOS_METEOR
	SUN_STRIKE
	DEAFENING_BLAST
)

var SpellOrbCombinations = map[int][]int{
	COLD_SNAP:       {QUAS, QUAS, QUAS},
	GHOST_WALK:      {QUAS, QUAS, WEX},
	ICE_WALL:        {QUAS, QUAS, EXORT},
	TORNADO:         {WEX, WEX, QUAS},
	EMP:             {WEX, WEX, WEX},
	ALACRITY:        {WEX, WEX, EXORT},
	FORGE_SPIRIT:    {EXORT, EXORT, QUAS},
	CHAOS_METEOR:    {EXORT, EXORT, WEX},
	SUN_STRIKE:      {EXORT, EXORT, EXORT},
	DEAFENING_BLAST: {QUAS, WEX, EXORT},
}

type SpellsPlayerProperties struct {
	Last     string
	Current  string
	Username string
}

type Spells struct {
	P1 SpellsPlayerProperties
	P2 SpellsPlayerProperties
}

func NewSpells(p1 string, p2 string) Spells {
	return Spells{P1: SpellsPlayerProperties{}, P2: SpellsPlayerProperties{}}
}
