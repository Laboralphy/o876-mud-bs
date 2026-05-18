# Abilities Reference

There are four core abilities. Each has a raw score (default 10) and a derived modifier.

**Modifier formula:** `mod(score) = floor(score / 2) - 5`

| Score | Modifier |
|---|---|
| 3 | -4 |
| 6 | -2 |
| 8 | -1 |
| 10 | 0 |
| 12 | +1 |
| 14 | +2 |
| 16 | +3 |
| 18 | +4 |
| 20 | +5 |

**Skill check formula:** `d20 + mod(primary) + floor(mod(secondary) / 2) + conditions`

---

## BODY

Physical mass, raw strength, and the body's capacity to absorb punishment. Not just muscle — the density of bone, the
thickness of skin, the biological stubbornness of a creature that refuses to go down. The foundation everything else
is built on. When it fails, nothing else matters.

### Derived Stats (primary)

| Stat | Formula |
|---|---|
| **Hit Points** | `BODY × 8 + 20` |
| **Vigor Save** | `d20 + mod(BODY) + floor(mod(BODY) / 2)` |

### Derived Stats (secondary)

| Stat | Formula |
|---|---|
| **Armor Class** | `8 + mod(SENSE) + floor(mod(BODY) / 2) + natural_armor` |
| **Finesse Attack** | `max(mod(BODY), mod(SENSE))` *(melee weapons with the Finesse attribute)* |

### Skills (primary)

- Athletics
- Endurance
- Acrobatics
- Stealth
- Discipline
- Survival
- Intimidation
- Seduction

### Skills (secondary)

- Tracking
- Navigation
- Medicine
- Alchemy
- Leadership
- Morale

---

## SENSE

The processing speed of the nervous system — how quickly and accurately the creature perceives and responds to the
world. Reflexes, spatial awareness, precision of movement. Not the raw power to act, but the accuracy of the signal
between reality and response. A creature with high Sense doesn't just notice more. It processes faster.

### Derived Stats (primary)

| Stat | Formula |
|---|---|
| **Armor Class** | `8 + mod(SENSE) + floor(mod(BODY) / 2) + natural_armor` |
| **Reflex Save** | `d20 + mod(SENSE) + floor(mod(SENSE) / 2)` |
| **Finesse Attack** | `max(mod(BODY), mod(SENSE))` *(melee weapons with the Finesse attribute)* |

### Skills (primary)

- Tracking
- Navigation
- Perception
- Reflex
- Investigation
- Trap Detection
- Insight
- Empathy

### Skills (secondary)

- Acrobatics
- Stealth
- Lockpicking
- Precision Crafting
- Streetwise
- Disguise

---

## MIND

The quality of cognition — pattern recognition, memory, analysis, and the capacity to apply knowledge under pressure.
Not wisdom. Not creativity. The ability to think clearly, and to keep thinking when the situation makes that difficult.
What separates a surgeon from a butcher, an engineer from a tinkerer, a mage from a dabbler.

### Derived Stats (primary)

*Mind has no direct impact on HP or AC. Its weight is entirely in skill performance and knowledge-based actions.*

### Skills (primary)

- Medicine
- Alchemy
- Lockpicking
- Precision Crafting
- Arcana
- Technology
- Persuasion
- Negotiation

### Skills (secondary)

- Discipline
- Survival
- Investigation
- Trap Detection
- Deception
- Politics

---

## PRESENCE

The force of self that a creature projects into the world — the weight of personality, conviction, and social gravity.
Not charm. Something more structural: the quality that makes a room change when you enter it, that makes people
listen before they know why, that makes a threat feel inevitable. Can be weaponized or suppressed, but never fully
hidden. Others feel it before they understand it.

### Derived Stats (primary)

*Presence has no direct impact on HP or AC. Its weight is in social and psychological interactions.*

### Skills (primary)

- Leadership
- Morale
- Streetwise
- Disguise
- Deception
- Politics
- Faith
- Aura

### Skills (secondary)

- Intimidation
- Seduction
- Insight
- Empathy
- Persuasion
- Negotiation

---

## Summary

| Ability | Derived Stats | Primary Skills | Secondary Skills |
|---|---|---|---|
| BODY | Hit Points, Vigor Save | 8 | 6 |
| SENSE | Armor Class, Reflex Save, Finesse Attack | 8 | 6 |
| MIND | — | 8 | 6 |
| PRESENCE | — | 8 | 6 |

**Every ability drives exactly 8 skills as primary and 6 as secondary.**
BODY and SENSE are the only abilities that directly shape combat stats (HP and AC).
MIND and PRESENCE operate exclusively through skill performance.
