package engine

import (
	"fmt"
	"math/rand"
	"reflect"
	"slices"
	"sort"
)

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

var SPELLS = []int{COLD_SNAP, GHOST_WALK, ICE_WALL, TORNADO, EMP, ALACRITY, FORGE_SPIRIT, CHAOS_METEOR, DEAFENING_BLAST}

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
}

type GeneratedSpell struct {
	Username string `json:"username"`
	Spell    int    `json:"spell"`
}

func getRandomSpell(excluded int) int {
	if excluded == -1 {
		return SPELLS[rand.Intn(len(SPELLS))]
	} else {
		fmt.Println(excluded)
		index := slices.Index(SPELLS, excluded)
		availableSpells := append(SPELLS[:index], SPELLS[index+1:]...)
		return availableSpells[rand.Intn(len(SPELLS))]
	}
}

func (p *PlayerSpells) GenerateSpell() int {
	spell := getRandomSpell(p.Last)
	p.Current = spell
	return spell
}

func (p *PlayerSpells) ValidateSpell(orbs []int) bool {
	combination := SPELL_ORB_COMBINATIONS[p.Current]
	actualOrbs := sort.IntSlice(combination)
	sentOrbs := sort.IntSlice(orbs)
	return reflect.DeepEqual(actualOrbs, sentOrbs)
}
