# Diseases

Diseases are a special subtype of `EFFECT_DISEASE`. Each carries a `disease` field naming the specific affliction, an `amp` representing the current stage (1–4), and an optional `dc` the creature must beat with a Survival check to resist progression.

Each day of in-game time (or after each long rest), the engine checks whether the disease advances. The creature rolls:

```
1d20 + SKILL_SURVIVAL >= disease dc  →  stage holds or improves
```

Failing the check increments `amp`. Reaching stage 0 means recovery; reaching the maximum stage triggers the terminal outcome described below.

**Stage effects are synthetic.** When a creature moves from one stage to the next, all effects applied by the previous stage are removed, and the new stage's full effect set is applied from scratch. Each table below is therefore the complete, self-contained list of effects active at that stage — not a delta from the previous one.

---

## Ghoul Fever

**Contracted from:** A bite or claw strike from a ghoul or ghast.  
**Subtype:** `EFFECT_SUBTYPE_SUPERNATURAL`  
**Resistance DC:** 14  
**Resisted by:** Survival (BODY)

Ghoul fever does not kill its host — it *changes* them. The creature's appetite warps, its flesh cools, and its mind begins to hollow out until what remains is only hunger.

### Stage 1 — Pallor
*Days 1–2*

Pallid skin, hollow eyes, persistent chills. Others notice something is wrong before the victim does.

| Effect | Parameters |
|---|---|
| `EFFECT_ABILITY_MODIFIER` | BODY −2 |
| `EFFECT_ABILITY_MODIFIER` | PRESENCE −2 |

### Stage 2 — Craving
*Days 3–5*

An uncontrollable hunger for raw meat — and, increasingly, for things that are still moving. The creature grows irritable and erratic. Social awareness is replaced by obsession; the pallor fades into something more feral.

| Effect | Parameters |
|---|---|
| `EFFECT_ABILITY_MODIFIER` | BODY −4 |
| `EFFECT_ABILITY_MODIFIER` | MIND −2 |
| `EFFECT_SKILL_MODIFIER` | SKILL_DISCIPLINE −4 |
| `EFFECT_SKILL_MODIFIER` | SKILL_PERSUASION −3 |

### Stage 3 — Necrosis
*Days 6–8*

Flesh visibly greys and stiffens. Reflexes slow. The creature experiences brief blackouts and has largely stopped speaking coherently. Companions may be forced to restrain it.

| Effect | Parameters |
|---|---|
| `EFFECT_ABILITY_MODIFIER` | BODY −6 |
| `EFFECT_ABILITY_MODIFIER` | SENSES −2 |
| `EFFECT_ABILITY_MODIFIER` | MIND −4 |
| `EFFECT_SPEED_FACTOR` | amp 0.5 |
| `EFFECT_SKILL_MODIFIER` | SKILL_DISCIPLINE −6 |

### Stage 4 — Transformation *(terminal)*
*Day 9+*

The creature dies and rises as a ghoul. If brought to 0 hit points while in this stage, it does not make death saves — it reanimates at the start of the next round as an undead creature hostile to all living things. Only a `remove disease` or equivalent magical intervention before death can prevent this.

| Effect | Parameters |
|---|---|
| `EFFECT_ABILITY_MODIFIER` | BODY −8 |
| `EFFECT_ABILITY_MODIFIER` | SENSES −2 |
| `EFFECT_ABILITY_MODIFIER` | MIND −4 |
| `EFFECT_SPEED_FACTOR` | amp 0.5 |
| `EFFECT_PARALYSIS` | dc 0 (permanent until death) |
| `EFFECT_DAMAGE` | `DAMAGE_TYPE_CHEMICAL`, 1d6 per day |

**Cure:** Remove the disease before stage 4. Magical cures work at any stage. No natural recovery is possible at stage 3 or 4.

---

## Mummy Rot

**Contracted from:** A strike from a mummy, or activating a cursed burial seal.  
**Subtype:** `EFFECT_SUBTYPE_MAGICAL`  
**Resistance DC:** 16  
**Resisted by:** Survival (BODY)

Mummy rot is a curse wearing a disease's face. It unmakes the body slowly — crumbling skin, brittle bones, the smell of the tomb — and it refuses to let healing undo its work. Normal medicine is useless. Only magic that targets curses can interrupt it.

### Stage 1 — The Drying
*Days 1–3*

Skin tightens and cracks. Wounds close more slowly. The creature feels perpetually thirsty regardless of how much it drinks.

| Effect | Parameters |
|---|---|
| `EFFECT_ABILITY_MODIFIER` | BODY −1 |
| `EFFECT_HEALING_FACTOR` | amp 0.5 (healing halved) |

### Stage 2 — Desiccation
*Days 4–7*

Flesh visibly deteriorates at the edges of wounds and joints. Healing magic fizzles on contact. The creature loses weight it cannot explain.

| Effect | Parameters |
|---|---|
| `EFFECT_ABILITY_MODIFIER` | BODY −3 |
| `EFFECT_ABILITY_MODIFIER` | SENSES −2 |
| `EFFECT_HEALING_FACTOR` | amp 0 (no healing whatsoever) |

### Stage 3 — Corruption
*Days 8–12*

The creature begins to crumble. Small pieces flake from extremities. Internal organs show signs of mummification. The creature takes passive damage every day.

| Effect | Parameters |
|---|---|
| `EFFECT_ABILITY_MODIFIER` | BODY −6 |
| `EFFECT_ABILITY_MODIFIER` | SENSES −4 |
| `EFFECT_HEALING_FACTOR` | amp 0 |
| `EFFECT_DAMAGE` | `DAMAGE_TYPE_CHEMICAL`, 1d8 per day |

### Stage 4 — Final Rot *(terminal)*
*Day 13+*

The creature crumbles to dust. Death cannot be reversed by normal means while the curse remains on the corpse — resurrection spells fail unless the rot is first removed from the body.

| Effect | Parameters |
|---|---|
| `EFFECT_ABILITY_MODIFIER` | BODY −10 |
| `EFFECT_ABILITY_MODIFIER` | SENSES −4 |
| `EFFECT_HEALING_FACTOR` | amp 0 |
| `EFFECT_DAMAGE` | `DAMAGE_TYPE_CHEMICAL`, 2d6 per day |

**Cure:** Requires a magical cure or `remove curse`. Natural recovery is impossible. Survival rolls still apply but cannot advance the creature past stage 1 without magical intervention — they only prevent further progression.

---

## Rat Sickness

**Contracted from:** A rat bite, contact with rat-infested waste, or drinking contaminated water.  
**Subtype:** `EFFECT_SUBTYPE_EXTRAORDINARY`  
**Resistance DC:** 11  
**Resisted by:** Survival (BODY)

The most common disease adventurers encounter — and the most survivable, for those who rest and eat properly. Rat sickness is mundane filth fever: a bacterial infection that overwhelms the body with fever and, if untreated, confusion and organ failure. Most healthy adults recover on their own. Adventurers rarely get the rest they need.

### Stage 1 — Nausea
*Days 1–2*

Stomach cramps, cold sweats, loss of appetite. Unpleasant but manageable.

| Effect | Parameters |
|---|---|
| `EFFECT_ABILITY_MODIFIER` | BODY −1 |
| `EFFECT_SKILL_MODIFIER` | SKILL_DISCIPLINE −2 |

### Stage 2 — Fever
*Days 3–5*

High temperature, head pain, muscle aches. Thinking clearly becomes difficult. The creature's pace slows.

| Effect | Parameters |
|---|---|
| `EFFECT_ABILITY_MODIFIER` | BODY −2 |
| `EFFECT_ABILITY_MODIFIER` | MIND −2 |
| `EFFECT_SPEED_FACTOR` | amp 0.75 |
| `EFFECT_SKILL_MODIFIER` | SKILL_PERCEPTION −2 |
| `EFFECT_SKILL_MODIFIER` | SKILL_DISCIPLINE −2 |

### Stage 3 — Delirium
*Days 6–8*

The fever peaks. The creature is bedridden, suffering vivid hallucinations. It can barely distinguish friend from threat.

| Effect | Parameters |
|---|---|
| `EFFECT_ABILITY_MODIFIER` | BODY −4 |
| `EFFECT_ABILITY_MODIFIER` | MIND −4 |
| `EFFECT_SPEED_FACTOR` | amp 0.5 |
| `EFFECT_BLINDNESS` | (hallucinations overwhelm real sight) |
| `EFFECT_SKILL_MODIFIER` | SKILL_PERCEPTION −4 |
| `EFFECT_SKILL_MODIFIER` | SKILL_DISCIPLINE −4 |

### Stage 4 — Crisis *(terminal if unresolved)*
*Day 9+*

The fever has lasted too long. Organs begin to fail. The creature takes damage each day. The delirium persists — the body is breaking down but the fever has not broken.

| Effect | Parameters |
|---|---|
| `EFFECT_ABILITY_MODIFIER` | BODY −6 |
| `EFFECT_ABILITY_MODIFIER` | MIND −6 |
| `EFFECT_SPEED_FACTOR` | amp 0.5 |
| `EFFECT_BLINDNESS` | (hallucinations persist) |
| `EFFECT_SKILL_MODIFIER` | SKILL_PERCEPTION −4 |
| `EFFECT_SKILL_MODIFIER` | SKILL_DISCIPLINE −4 |
| `EFFECT_DAMAGE` | `DAMAGE_TYPE_CHEMICAL`, 1d4 per day |

**Cure:** Natural recovery is possible at any stage (Survival DC 11 per day). Medical treatment via the First Aid or Alchemy action reduces the DC. Full bed rest grants advantage on the Survival roll. Stage 4 requires active treatment — passive rest alone is insufficient.

---

## Reference table

| Disease | Stages | DC | Subtype | Terminal outcome |
|---|---|---|---|---|
| Ghoul Fever | 4 | 14 | Supernatural | Rises as a ghoul |
| Mummy Rot | 4 | 16 | Magical | Crumbles to dust; resurrection blocked |
| Rat Sickness | 4 | 11 | Extraordinary | Organ failure; daily `DAMAGE_TYPE_CHEMICAL` damage |
