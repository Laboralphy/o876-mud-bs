# Combat & Rules System — Overview

This is a text-based RPG engine (MUD) built around a d20 resolution system with four ability scores and a reactive property/effect architecture. Use this document as context when designing lore, monsters, items, or world content.

---

## Ability Scores

Every creature has four abilities scored from 1 to 20 (default 10, modifier 0):

| Ability | Role |
|---|---|
| **BODY** | Strength, endurance, melee accuracy, hit points |
| **SENSES** | Reflexes, perception, ranged accuracy, evasion |
| **MIND** | Intelligence, arcana, investigation |
| **PRESENCE** | Charisma, leadership, social influence, faith |

Modifier = `floor((score − 10) / 2)`, ranging from −5 to +5.

---

## Hit Points & Survival

```
maxHP = BODY_modifier × 8 + 20
```

A creature with average BODY (10) starts at 20 HP. A powerful warrior with BODY 18 reaches 52 HP. HP is clamped to [0, maxHP]; reaching 0 means death unless stabilized.

---

## Armor Class

```
AC = 8 + SENSES_modifier + floor(BODY_modifier / 2) + naturalArmor
```

Agile creatures are hard to hit. Bulk helps, but only at half value. Worn armor and natural hide (scales, thick skin) add directly on top. AC can be further modified by attack type, damage type, and attacker specie — resistances and vulnerabilities shape the final number.

---

## Attack Resolution

Each attack rolls `1d20 + attackBonus` against the target's AC.

- **Natural 1** — automatic miss (fumble)
- **Natural 20** — automatic hit, double damage (critical)
- **Otherwise** — hit if `roll + bonus ≥ AC`

**Attack bonus sources:**
- Melee attacks are seeded from the BODY modifier
- Ranged attacks are seeded from the SENSES modifier
- Finesse weapons use the better of BODY or SENSES in melee
- Properties, effects, and specie matchups add further flat bonuses

**Damage:**
- Melee: `weapon dice + BODY modifier` (two-handed/versatile weapons add BODY twice)
- Ranged: `weapon dice only` (no ability bonus)
- Critical hits double the final total

---

## Visibility & Stealth

Before a hit is resolved, visibility is checked. If only the attacker is impaired (blind, in darkness, facing an invisible or stealthed target), there is a **50% miss chance**. Darkvision negates darkness. Stealth is resolved as an opposed skill contest (STEALTH vs PERCEPTION).

States: Visible / Blinded / Invisible / Hidden / Darkness.

---

## Damage Types & Resistances

Damage has a type (slashing, piercing, crushing, thermal, necrotic, radiant, cryogenic, poison, etc.). Creatures can have:
- **Immunity** — take no damage of that type
- **Resistance** — take half damage
- **Vulnerability** — take double damage

Hybrid weapons (two damage types) exploit the weaker defense.

---

## Properties & Effects

The engine distinguishes two layers:
- **Properties** — permanent traits baked into a creature or item (e.g. darkvision, damage resistance, natural armor)
- **Effects** — temporary states applied at runtime (e.g. blindness, invisibility, poison, bless, rage)

Both can hook into attack resolution to modify AC, attack bonus, or damage at the last moment.

Common status effects: paralysis, stun, fear, charm, petrification, poison, disease, invisibility, stealth, blindness, light.

---

## Creatures

A creature blueprint defines:
- Specie (beast, humanoid, undead, construct, dragon, monstrosity, fiend, celestial…)
- Size (tiny → gargantuan)
- Base AC (natural armor bonus)
- Ability scores
- Proficiencies (unarmed, simple/complex weapons, light/medium/heavy armor, shield)
- Equipment (weapons, armor, natural weapons like claws or bite)
- Special actions (breath weapons, frightful presence, wing buffets…) with cooldowns and charges
- Trait bundles (e.g. `cp-undead` grants darkvision + necrotic resistance + radiant vulnerability)

---

## Skills & Non-Combat Actions

42 player commands resolved as `1d20 + mod(primaryStat) + floor(mod(secondaryStat) / 2) + conditions`:

| Category | Examples |
|---|---|
| Movement | climb, swim, bash, flee, navigate |
| Combat | sneak attack, intimidate, rally |
| Stealth | hide, stalk, disguise, bluff |
| Exploration | search, scan, disarm traps, investigate |
| Survival & Medicine | heal, cook, harvest, treat poison, stabilize |
| Crafting | brew potions, craft, pick locks, hack systems |
| Social | comfort, barter, inspire, streetwise |
| Magic & Faith | identify magic, read runes, pray |

---

## Design Notes for Lore

- The system supports medieval fantasy through modern/sci-fi settings (lockpicking → hacking, alchemy → technology).
- BODY vs SENSES is the core tension: brute vs agile characters have meaningfully different combat profiles.
- Undead are typically immune to poison/disease, resistant to necrotic, vulnerable to radiant.
- Constructs are immune to paralysis, petrification, fear, and charm.
- Natural weapons (claws, bite, stinger, gore) are first-class items — they can carry properties like ailments (poison, paralysis, petrification) or bonus damage types.
- Action scripts drive special monster abilities; they read from an action blueprint config (damage type, amp, DC, ailment type, duration, etc.).
