# Vitals

Vitals are the core numbers that define a creature's durability and fighting capability. They are derived
from ability scores and size, then modified by equipment, effects, and innate properties.

---

## Creature Size

Size is a fundamental property of a creature. It affects how much punishment it can absorb, how easy it
is to hit, and what kind of space it occupies in a fight. Size is fixed at creation and does not change
unless a magical effect alters it.

| Size        | Description                                                      |
|-------------|------------------------------------------------------------------|
| Tiny        | A rat, a sprite, a severed hand with ideas.                      |
| Small       | A halfling, a goblin, a wolf cub.                                |
| Medium      | A human, an orc, a wolf. The baseline.                           |
| Large       | A horse, a bear, an ogre.                                        |
| Huge        | A giant, a young dragon, a siege engine with opinions.           |
| Gargantuan  | An ancient dragon, a kraken, a creature that redefines the room. |

Size feeds directly into both hit points and armor class — larger creatures have more endurance but are
easier to land a blow on; smaller creatures are harder to hit but fold faster when they are.

---

## Hit Points

Hit points represent how much damage a creature can sustain before it is defeated. They are not purely
meat — they represent stamina, composure, fighting will, and the capacity to keep going. The last few
hit points are not shallow cuts; they are the edge where the creature is still standing despite
everything.

### Formula

```
Maximum Hit Points = (BODY modifier × Hit Dice) + Base HP
```

Where **Hit Dice** and **Base HP** depend on size:

| Size        | Base HP | Hit Dice |
|-------------|--------:|:--------:|
| Tiny        |      10 |    d4    |
| Small       |      15 |    d6    |
| Medium      |      20 |    d8    |
| Large       |      30 |    d10   |
| Huge        |      40 |    d12   |
| Gargantuan  |      50 |    d16   |

> A medium creature with a BODY modifier of +2 has a maximum of **2 × 8 + 20 = 36** hit points.
> A huge creature with a BODY modifier of −1 has a maximum of **−1 × 12 + 40 = 28** hit points.

**BODY** is the dominant ability here. A high BODY score means a creature has deep reserves and absorbs
punishment that would floor a lesser fighter. A low BODY means even a large creature may be fragile —
the mass is there, but not the biological will to use it.

### Modifying Hit Points

Effects and properties can add extra hit points on top of the maximum (`EFFECT_EXTRA_HITPOINTS`,
`PROPERTY_EXTRA_HITPOINTS`). These are temporary or conditional bonuses that stack with the base value
but do not change the underlying formula.

---

## Armor Class

Armor Class represents how difficult a creature is to damage. It is not simply how hard it is to touch —
a high AC creature may be perfectly easy to hit but nearly impossible to harm meaningfully. AC combines
reflexive dodge, hardness of hide, and the wearing of physical protection.

### Formula

```
AC = Size AC + min(SENSES modifier, max SENSES bonus) + floor(BODY modifier / 2)
   + Natural Armour + Equipped Armour + Equipped Shield
```

Where **Size AC** reflects how easy a creature of that bulk is to land a solid blow on:

| Size        | Size AC |
|-------------|--------:|
| Tiny        |      12 |
| Small       |      10 |
| Medium      |       8 |
| Large       |       7 |
| Huge        |       6 |
| Gargantuan  |       5 |

**SENSES** contributes up to a maximum cap (`PROPERTY_MAX_SENSES_BONUS`). Heavy armour typically sets
this cap to a low value — a creature in full plate cannot dodge as freely as one unencumbered. Without
any cap property, SENSES contributes in full.

**BODY** contributes at half — physical density and resilience matter, but sheer mass can also make a
creature a bigger target.

**Natural Armour** is an intrinsic value set per creature: scales, thick hide, a stone shell. It does
not come from equipment.

**Equipped Armour and Shield** each contribute their own `armorClass` value when worn. These are
separate from natural armour and from each other.

> A medium creature with SENSES +2, BODY +1, and no natural armour has a base AC of
> **8 + 2 + 0 (floor of 0.5) + 0 = 10**.

> The same creature wearing armour with armorClass 4 has AC **14**.

### Contextual Modifiers

Base AC applies to all incoming attacks. On top of this, additional modifiers may apply to specific
categories of attack:

- **By attack type** — melee or ranged. A shield may protect only against melee; a spell-ward may
  apply only to ranged.
- **By attacker species** — a ward specifically against undead, or a racial hatred that makes a
  creature easier to hit.
- **By damage type** — resistance to slashing attacks, vulnerability to fire expressed as an AC
  penalty.

These conditional bonuses stack on top of base AC and are evaluated per attack.

---

## Attack Bonus

Attack Bonus determines how reliably a creature lands its blows. It is added to a d20 roll and compared
against the target's Armor Class. An attack hits if the total meets or exceeds the AC.

### Formula

```
Melee attack roll  = 1d20 + BODY modifier + flat bonus
Ranged attack roll = 1d20 + SENSES modifier + flat bonus
```

**BODY** governs melee — the strength to drive a blow through a guard, the mass behind a swing.

**SENSES** governs ranged — the precision to read distance, wind, and movement; to release at the right
moment.

**Flat bonus** accumulates from effects and properties that improve attack broadly, without specifying
a weapon type or target species.

### Contextual Modifiers

As with AC, attack bonus can carry conditional additions:

- **By attack type** — a property that sharpens melee skill, or an effect that steadies the hand for
  ranged attacks.
- **By target species** — a hunter's studied advantage against a particular kind of creature; a
  warrior's hatred that translates into better aim.

These stack on top of the base roll when the condition matches the attack being made.

### Critical Hits and Fumbles

A natural **20** on the d20 is a critical hit — an automatic success regardless of the target's AC,
dealing additional damage. A creature immune to critical hits treats a roll of 20 as a normal result,
subject to the target's AC.

A natural **1** is a fumble — an automatic miss regardless of bonuses.

---

## Summary

| Vital        | Primary ability | Secondary ability | Size matters? |
|--------------|-----------------|-------------------|:-------------:|
| Hit Points   | BODY (full)     | —                 | Yes           |
| Armor Class | SENSES (full)   | BODY (half)       | Yes           |
| Melee attack | BODY (full)     | —                 | No            |
| Ranged attack| SENSES (full)   | —                 | No            |
