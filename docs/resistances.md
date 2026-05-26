# Resistances

Some effects can be shaken off. When an effect has a `dc` field, the engine can call `creature.checkSkill(resistingSkill, dc)` at the right moment — if the roll succeeds, the effect is removed immediately.

The resisting skill for each effect is defined in `src/data/skills.json`. The lookup is performed at runtime by `getResistingSkill(effectType)`.

```
resist roll: 1d20 + skillValue >= dc  →  effect removed
```

---

## Paralysis

**Resisted by:** Athletics (BODY)

Complete loss of motor control. The creature cannot act, fight, or move.

| Blocks | Getter |
|---|---|
| All actions | `canAct = false` |
| Attacking | `canFight = false` |
| Movement | `canMove = false` |

**Resistance trigger:** Every time the paralysed creature takes damage, it may attempt a Athletics check against the effect's `dc`. A success removes the paralysis immediately — pain can jolt a body back into motion.

---

## Stun

**Resisted by:** Discipline (BODY)

A hard blow to the head, a sonic burst, a nerve strike — the creature is dazed and cannot coordinate action or movement.

| Blocks | Getter |
|---|---|
| All actions | `canAct = false` |
| Attacking | `canFight = false` |
| Movement | `canMove = false` |

**Resistance trigger:** Every time the stunned creature takes damage, it may attempt a Discipline check against the effect's `dc`. Willpower and pain tolerance can pull a creature back into the fight faster than the stun would otherwise allow.

---

## Root

**Resisted by:** Acrobatics (SENSES)

The creature is held in place — by vines, ice, a gravity spike, or anything that locks the feet. It can still act and fight, but cannot move.

| Blocks | Getter |
|---|---|
| Movement | `canMove = false` |

**Resistance trigger:** Every time the rooted creature takes damage, it may attempt an Acrobatics check against the effect's `dc`. The shock of impact can create the split-second opening needed to wrench free.

---

## Charm

**Resisted by:** Aura (PRESENCE)

The creature is bound to the charmer. It cannot attack the charmer — any such attack is automatically aborted with `ATTACK_FAILURE_CHARMED`. The charmer's id is tracked in `getCharmerSet` (a set of source ids from all active `EFFECT_CHARM` effects on the creature).

| Blocks | Getter |
|---|---|
| Attacking the charmer | `ATTACK_FAILURE_CHARMED` |

**Resistance trigger:** When the charmed creature is attacked by the charmer, it may attempt an Aura check against the effect's `dc`. Being targeted by the charmer tests the creature's sense of self enough to break the bond.

---

## Disease

**Resisted by:** Survival (BODY)

A progressive infection. The `disease` field names the specific disease (`DISEASE_GHOUL_FEVER`, `DISEASE_MUMMY_ROT`, `DISEASE_RAT_SICKNESS`). The `amp` field represents the intensity or current stage.

**Resistance trigger:** Defined by the effect's `dc` field; the resistance mechanic is not yet active (program stub).

---

## Poison

**Resisted by:** Alchemy (MIND)

A toxic substance dealing ongoing damage. The `amp` field sets the damage per tick.

**Resistance trigger:** Defined by the effect's `dc` field; the resistance mechanic is not yet active (program stub).

---

## Fear

**Resisted by:** Faith (PRESENCE)

Overwhelming dread that suppresses the will to fight. A frightened creature cannot engage in combat.

| Blocks | Getter |
|---|---|
| Attacking | `canFight = false` |

**Resistance trigger:** Defined by the effect's `dc` field; the resistance mechanic is not yet active (program stub).

---

## Petrification

**Resisted by:** *(no skill)*

The creature is turning to stone. Like paralysis and stun it locks out all action and movement, but it has no resisting skill — it cannot be shaken off through effort alone.

| Blocks | Getter |
|---|---|
| All actions | `canAct = false` |
| Attacking | `canFight = false` |
| Movement | `canMove = false` |

The `amp` field (default 1) controls the severity or progression stage.

---

## Summary table

| Effect | Resisting skill | Ability | Trigger |
|---|---|---|---|
| `EFFECT_PARALYSIS` | Athletics | BODY | On damage taken |
| `EFFECT_STUN` | Discipline | BODY | On damage taken |
| `EFFECT_ROOT` | Acrobatics | SENSES | On damage taken |
| `EFFECT_CHARM` | Aura | PRESENCE | On being attacked by charmer |
| `EFFECT_DISEASE` | Survival | BODY | *(not yet active)* |
| `EFFECT_POISON` | Alchemy | MIND | *(not yet active)* |
| `EFFECT_FEAR` | Faith | PRESENCE | *(not yet active)* |
| `EFFECT_PETRIFICATION` | — | — | Cannot be resisted |
