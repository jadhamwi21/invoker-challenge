package engine

import (
	"math/rand"
	"reflect"
	"slices"
)

// Orbs
const (
	QUAS = iota
	WEX
	EXORT
)

var ORB_KEY_TO_ENUM map[string]int = map[string]int{"Q": QUAS, "W": WEX, "E": EXORT}

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

var SPELLS = []int{COLD_SNAP, GHOST_WALK, ICE_WALL, TORNADO, EMP, ALACRITY, FORGE_SPIRIT, CHAOS_METEOR, SUN_STRIKE, DEAFENING_BLAST}

var SPELL_ORB_COMBINATIONS = map[int][]int{
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

type PlayerSpells struct {
	Last    int
	Current int
	Invoked []int
}

func NewPlayerSpells() *PlayerSpells {
	return &PlayerSpells{Last: -1, Current: -1, Invoked: []int{}}
}

type GeneratedSpell struct {
	Username string `json:"username"`
	Spell    int    `json:"spell"`
}

func (p *PlayerSpells) getRandomSpell() int {
	if p.Last == -1 {
		return SPELLS[rand.Intn(len(SPELLS))]
	}

	var availableSpells []int
	for _, spell := range SPELLS {
		if spell != p.Last {
			availableSpells = append(availableSpells, spell)
		}
	}

	return availableSpells[rand.Intn(len(availableSpells))]
}
func (p *PlayerSpells) GenerateSpell() int {
	if p.Current != -1 {
		p.Invoked = append(p.Invoked, p.Current)
	}
	p.Last = p.Current
	spell := p.getRandomSpell()
	p.Current = spell

	return spell
}

func (p *PlayerSpells) ValidateInvokation(orbs []int) bool {
	combination := SPELL_ORB_COMBINATIONS[p.Current]
	slices.Sort(combination)
	slices.Sort(orbs)
	return reflect.DeepEqual(combination, orbs)
}
