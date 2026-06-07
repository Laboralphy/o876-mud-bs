# Skills

Skills represent learned competencies layered on top of raw ability scores. A creature's effective skill value combines the modifier of the linked ability with any bonuses from properties and effects.

---

## Skill checks

### Simple check

Roll a 1d20, add skill bonus and corresponding ability modifier. If the result is higher than a given difficulty class, the check succeeds.

| Difficulty class | DC |
|---|----|
| Trivial | 5  |
| Easy | 10 |
| Normal | 15 |
| Hard | 20 |
| Very Hard | 25 |
| Impossible | 30 |


### Opposed check

Both creatures roll independently. The creature getting the best result wins.
Stealth vs. Perception is an example of an opposed check.

---

## Skill list

### BODY skills

**Athletics** — Raw physical power applied to movement: climbing, swimming, jumping, forcing barriers. Some locations are unreachable without it.

**Discipline** — Enduring pain, stun, exhaustion, and hunger while continuing to function. Resistance to stun effect is triggered whenever a stunned creature takes damage.

**Survival** — Staying alive in hostile environments through practical knowledge: foraging, shelter, first aid, reading the land.

**Martial Expertise** — Advanced combat technique — not hitting harder, but applying force with precision and timing.

---

### SENSES skills

**Acrobatics** — Precise movement through difficult space: vaulting, tumbling, balancing, landing without injury.

**Stealth** — Moving without being seen or heard. Used in the visibility system: when a creature is in `STEALTH` mode, observers make an **opposed check** (`STEALTH` vs `PERCEPTION`) to detect it.

**Perception** — Noticing what is out of place. Opposes Stealth in detection contests for active searches.

**Sleight of Hand** — Fine motor control: picking locks, disarming traps, palming objects.

---

### MIND skills

**Arcana** — Understanding magic as a system: identifying spells, reading magical writing, evaluating unknown artifacts.

**Technology** — Understanding machines: repairing, modifying, and bypassing mechanical and electronic systems.

**Investigation** — Active methodical searching: crime scenes, hidden compartments, cross-referencing accounts for inconsistencies.

**Alchemy** — Chemical and biological knowledge: combining reagents into potions, poisons, and compounds.

---

### PRESENCE skills

**Persuasion** — Changing minds through reasoned argument.

**Faith** — Absolute conviction in something larger than the self. Mechanical resistance to `FEAR`.

**Haggle** — Negotiation, valuation, and trade.

**Aura** — Projecting presence, will, and dominance. Resistance to `CHARM` is triggered whenever a charmed creature is attacked by the source of the charm.


## Skill resistance

Some skills are designated as the natural counter to one status effect. When that effect's program triggers a resistance opportunity (on damage taken or on being attacked), it calls `checkSkill(skill, effect.data.dc)`. A successful check removes the effect immediately.

| Skill             | Ability  | Counters    | Trigger resistance                 |
|-------------------|----------|-------------|------------------------------------|
| Athletics         | BODY     | `PARALYSIS` | On damage taken while paralysed    |
| Discipline        | BODY     | `STUN`      | On damage taken while stunned      |
| Survival          | BODY     | `DISEASE`   | At each disease stage beginning    |
| Martial Expertise | BODY     | —           | —                                  |
| Acrobatics        | SENSES   | `BLAST`     | On damage taken while rooted       |
| Stealth           | SENSES   | —           | —                                  |
| Perception        | SENSES   | `BLINDNESS` | When a blindness effect is applied |
| Sleight of Hand   | SENSES   | —           | —                                  |
| Arcana            | MIND     | —           | —                                  |
| Technology        | MIND     | —           | —                                  |
| Investigation     | MIND     | —           | —                                  |
| Alchemy           | MIND     | `POISON`    | At application and each poison tick |
| Persuasion        | PRESENCE | —           | —                                  |
| Faith             | PRESENCE | `FEAR`      | When a fear effect is applied      |
| Haggle            | PRESENCE | —           | —                                  |
| Aura              | PRESENCE | `CHARM`     | On being attacked by the charmer   |
