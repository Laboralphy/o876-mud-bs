# Skills

Skills represent learned competencies layered on top of raw ability scores. A creature's effective skill value combines the modifier of the linked ability with any bonuses from properties and effects.

---

## Skill value formula

```
skillValue = abilityModifier(linkedAbility) + skillBonus
```

`skillBonus` is the sum of all `PROPERTY_SKILL_MODIFIER` and `EFFECT_SKILL_MODIFIER` values keyed to that specific skill. Bonuses from different sources stack additively.

The getter `getSkillValues` returns a `Record<Skill, number>` with every skill's current value. `getSkillBonusValues` returns only the bonus portion (without the ability modifier).

---

## Skill checks

### Simple check — `checkSkill(skill, dc)`

```
roll 1d20 + skillValue
success = total >= dc
```

Emits `EVENT_CREATURE_SKILL_CHECK` (`creature.skill-check`) on the creature's event emitter:

```typescript
{
    creature: Creature,
    skill: Skill,
    dc: number,
    success: boolean,
}
```

### Opposed check — `checkSkillAgainst(skill, adversary, advSkill)`

Both creatures roll independently:

```
myTotal  = 1d20 + this.getSkillValues[skill]
advTotal = 1d20 + adversary.getSkillValues[advSkill]
success  = myTotal >= advTotal   // tie goes to the initiator
```

`EVENT_CREATURE_SKILL_CHECK` is emitted on **both** creatures. The adversary's event carries `dc = myTotal + 1` so that its `success` field reflects whether it beat the initiator's roll.

---

## Skill resistance

Each skill is designated as the natural counter to one status effect. When that effect's program triggers a resistance opportunity (on damage taken or on being attacked), it calls `checkSkill(skill, effect.data.dc)`. A successful check removes the effect immediately.

| Skill | Counters effect | Trigger |
|---|---|---|
| Athletics | `EFFECT_PARALYSIS` | On damage taken while paralysed |
| Discipline | `EFFECT_STUN` | On damage taken while stunned |
| Survival | `EFFECT_DISEASE` | *(program not yet active)* |
| Acrobatics | `EFFECT_ROOT` | On damage taken while rooted |
| Alchemy | `EFFECT_POISON` | *(program not yet active)* |
| Faith | `EFFECT_FEAR` | *(program not yet active)* |
| Aura | `EFFECT_CHARM` | On being attacked by the charmer |

The mapping is derived at runtime from `src/data/skills.json` via `getResistingSkill(effectType)`.

---

## Skill list

### BODY skills

| Skill | Ability | Counters |
|---|---|---|
| Athletics | BODY | EFFECT_PARALYSIS |
| Discipline | BODY | EFFECT_STUN |
| Survival | BODY | EFFECT_DISEASE |
| Martial Expertise | BODY | — |

**Athletics** — Raw physical power applied to movement: climbing, swimming, jumping, forcing barriers. Some locations are unreachable without it.

**Discipline** — Enduring pain, stun, exhaustion, and hunger while continuing to function. Resistance to `EFFECT_STUN` is triggered whenever a stunned creature takes damage.

**Survival** — Staying alive in hostile environments through practical knowledge: foraging, shelter, first aid, reading the land.

**Martial Expertise** — Advanced combat technique — not hitting harder, but applying force with precision and timing.

---

### SENSES skills

| Skill | Ability | Counters |
|---|---|---|
| Acrobatics | SENSES | EFFECT_ROOT |
| Stealth | SENSES | — |
| Perception | SENSES | — |
| Sleight of Hand | SENSES | — |

**Acrobatics** — Precise movement through difficult space: vaulting, tumbling, balancing, landing without injury.

**Stealth** — Moving without being seen or heard. Used in the visibility system: when a creature has `EFFECT_STEALTH`, observers make an **opposed check** (`SKILL_STEALTH` vs `SKILL_PERCEPTION`) to detect it.

**Perception** — Noticing what is out of place. Opposes Stealth in detection contests and is used by `checkSkill` for active searches.

**Sleight of Hand** — Fine motor control: picking locks, disarming traps, palming objects.

---

### MIND skills

| Skill | Ability | Counters |
|---|---|---|
| Arcana | MIND | — |
| Technology | MIND | — |
| Investigation | MIND | — |
| Alchemy | MIND | EFFECT_POISON |

**Arcana** — Understanding magic as a system: identifying spells, reading magical writing, evaluating unknown artifacts.

**Technology** — Understanding machines: repairing, modifying, and bypassing mechanical and electronic systems.

**Investigation** — Active methodical searching: crime scenes, hidden compartments, cross-referencing accounts for inconsistencies.

**Alchemy** — Chemical and biological knowledge: combining reagents into potions, poisons, and compounds.

---

### PRESENCE skills

| Skill | Ability | Counters |
|---|---|---|
| Persuasion | PRESENCE | — |
| Faith | PRESENCE | EFFECT_FEAR |
| Haggle | PRESENCE | — |
| Aura | PRESENCE | EFFECT_CHARM |

**Persuasion** — Changing minds through reasoned argument.

**Faith** — Absolute conviction in something larger than the self. Mechanical resistance to `EFFECT_FEAR`.

**Haggle** — Negotiation, valuation, and trade.

**Aura** — Projecting presence, will, and dominance. Resistance to `EFFECT_CHARM` is triggered whenever a charmed creature is attacked by the source of the charm.

---

## Modifying skills

### Via properties

```typescript
PropertyBuilder.buildProperty({
    type: CONSTS.PROPERTY_SKILL_MODIFIER,
    amp: 3,
    skill: CONSTS.SKILL_STEALTH,
});
```

Innate properties persist for the creature's lifetime. Equipment properties are active only while the item is equipped.

### Via effects

```typescript
{
    type: CONSTS.EFFECT_SKILL_MODIFIER,
    data: {
        type: CONSTS.EFFECT_SKILL_MODIFIER,
        amp: 2,
        skill: CONSTS.SKILL_PERCEPTION,
    },
    duration: 10,
    // ... standard effect fields
}
```

Effects are temporary and expire after `duration` ticks or on explicit removal.

Both sources stack additively. Multiple modifiers on the same skill are summed into `skillBonus` before `skillValue` is computed.
