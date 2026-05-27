# Attack

An `Attack` represents a single offensive action from one creature against another. It is constructed with `new Attack(attacker, target)`, then prepared with `init()` (or individual `initXXX()` calls), and finally resolved with `run()`.

```
new Attack(attacker, target)
    └── init()
          ├── initVisibility()
          ├── initWeapon()
          ├── initAbility()
          └── initTarget()
    └── run()
          ├── computeVisibility()
          ├── computeAttackBonus()
          ├── attacker.triggerAttackEvent(attack)
          ├── target.triggerAttackedEvent(attack)
          ├── computeHit()
          └── computeDamages()     ← only if hit === true
```

`init()` and `run()` can be called in sequence as a complete attack. Calling the `initXXX()` methods individually is supported for unit testing or for custom attack flows.

---

## Construction

```typescript
const attack = new Attack(attacker, target);
```

The constructor stores references to `attacker` and `target` and immediately allocates a `DiceRoll('1d20')` for the to-hit roll. That die is rolled once at construction time and its result is fixed for the lifetime of the attack. All public fields are set to their default values (see table below).

---

## Phase 1 — initVisibility()

Determines how each creature perceives the other.

```typescript
attack.targetVisibility   = attacker.getCreatureVisibility(target);
attack.attackerVisibility = target.getCreatureVisibility(attacker);
```

`getCreatureVisibility(other)` evaluates from the observer's point of view using the following priority chain:

| Priority | Condition | Result |
|---|---|---|
| 0 | `other === self` | `CREATURE_VISIBILITY_VISIBLE` |
| 1 | Observer has `EFFECT_BLINDNESS` | `CREATURE_VISIBILITY_BLINDED` |
| 2 | Observer's location has `ENVIRONMENT_FOG` | `CREATURE_VISIBILITY_BLINDED` |
| 3 | Target has `EFFECT_INVISIBILITY` and observer lacks `EFFECT_SEE_INVISIBILITY` | `CREATURE_VISIBILITY_INVISIBLE` |
| 4 | Target has `EFFECT_STEALTH` | skill contest (see below) |
| 5 | Observer is in a bright location | `CREATURE_VISIBILITY_VISIBLE` |
| 6 | Location has `ENVIRONMENT_DARKNESS` and observer has darkvision | `CREATURE_VISIBILITY_VISIBLE` |
| 7 | Observer has no location | `CREATURE_VISIBILITY_DARKNESS` |
| 8 | Location has `ENVIRONMENT_DARKNESS` (no darkvision) | `CREATURE_VISIBILITY_DARKNESS` |

**Bright location:** A location is bright if it has no fog, and either no darkness environment or at least one creature in the room wielding light (`EFFECT_LIGHT` or `PROPERTY_LIGHT`).

**Darkvision:** Granted by `EFFECT_DARKVISION` or `PROPERTY_DARKVISION`.

### Stealth skill contest

When the target has `EFFECT_STEALTH`, an opposed skill roll resolves detection:

```
observer.checkSkillAgainst(SKILL_STEALTH, target, SKILL_PERCEPTION)
```

- The **observer** rolls `1d20 + STEALTH skill bonus`
- The **target** rolls `1d20 + PERCEPTION skill bonus`
- Success (target is hidden): `observer.total >= target.total`
- Failure (target is visible): `observer.total < target.total`

If `EFFECT_SEE_INVISIBILITY` negates an invisibility effect but the target also has `EFFECT_STEALTH`, the stealth contest still runs.

### Visibility outcomes

| Constant | Meaning |
|---|---|
| `CREATURE_VISIBILITY_VISIBLE` | Normal sight |
| `CREATURE_VISIBILITY_BLINDED` | Observer cannot see at all |
| `CREATURE_VISIBILITY_INVISIBLE` | Target is magically invisible |
| `CREATURE_VISIBILITY_HIDDEN` | Target is hidden via stealth |
| `CREATURE_VISIBILITY_DARKNESS` | No light source available |

---

## Phase 2 — initWeapon()

Reads the attacker's currently selected offensive slot and fills in weapon metadata.

| Field | Source |
|---|---|
| `attack.weapon` | `attacker.getters.getSelectedWeapon` — falls back to `NULL_WEAPON` |
| `attack.ammo` | `attacker.getters.getSelectedWeaponAmmo` |
| `attack.attackType` | `ATTACK_TYPE_RANGED` if weapon has `WEAPON_ATTRIBUTE_RANGED`, else `ATTACK_TYPE_MELEE` |
| `attack.range` | `100` for ranged, `5` for melee |
| `attack.finesse` | `true` if weapon has `WEAPON_ATTRIBUTE_FINESSE` |

**Null weapon (unarmed):** When no weapon is equipped in the active slot, the attack falls back to a built-in `NULL_WEAPON`:

```json
{ "damages": "1d2", "damageType": "DAMAGE_TYPE_CRUSHING", "attributes": [] }
```

The null weapon is a small crushing weapon with no attributes, occupying the natural weapon slots.

### Weapon attributes

| Attribute | Effect |
|---|---|
| `WEAPON_ATTRIBUTE_RANGED` | Sets `attackType = RANGED`, `range = 100` |
| `WEAPON_ATTRIBUTE_FINESSE` | Enables best-of BODY/SENSES ability selection |
| `WEAPON_ATTRIBUTE_TWO_HANDED` | Adds BODY modifier twice to damage |
| `WEAPON_ATTRIBUTE_VERSATILE` | Adds BODY modifier twice when no shield is equipped |
| `WEAPON_ATTRIBUTE_AMMUNITION` | Requires loaded ammo |
| `WEAPON_ATTRIBUTE_REACH` | Extended melee reach |
| `WEAPON_ATTRIBUTE_SEMIAUTOMATIC` | Firearm: semi-auto fire mode |
| `WEAPON_ATTRIBUTE_SPREAD` | Firearm: spread/shotgun pattern |
| `WEAPON_ATTRIBUTE_LOADING` | Must be reloaded between shots |
| `WEAPON_ATTRIBUTE_SPECIAL` | Custom special rules |
| `WEAPON_ATTRIBUTE_IGNORE_ARMOR` | Bypasses armor-class modifiers |

---

## Phase 3 — initAbility()

Selects the ability score used for the attack roll and damage.

```
if finesse && SENSES modifier > BODY modifier:
    offensiveAbility = ABILITY_SENSES
else:
    offensiveAbility = ABILITY_BODY
```

`offensiveAbilityModifier` is set to the chosen ability's modifier. Finesse only applies to melee attacks; ranged attacks always use SENSES.

---

## Phase 4 — initTarget()

Calculates the effective Armor Class (`attack.ac`) the attacker must beat.

```
AC = base + attackTypeBonus + specieBonus + damageTypeBonus
```

| Component | Source |
|---|---|
| `base` | `ARMOR_CLASS_BASE_VALUE (8)` + SENSES modifier + floor(BODY modifier / 2) + `state.armorClass` |
| `attackTypeBonus` | From `PROPERTY_ARMOR_CLASS_MODIFIER` / `EFFECT_ARMOR_CLASS_MODIFIER` filtered by attack type |
| `specieBonus` | AC modifier keyed to the attacker's specie |
| `damageTypeBonus` | AC modifier keyed to the weapon's damage type |

**Hybrid weapons** (two damage types) exploit the weaker defense: `damageTypeBonus = Math.min(bonus1, bonus2)`.

---

## run()

Resolves the attack after `init()`. Internally calls:

### computeVisibility()

If `targetVisibility !== VISIBLE` and `attackerVisibility === VISIBLE` (only the attacker is impaired), there is a 50% miss chance:

```
roll 1d100:
  < 50  → attack.failed = true, attack.failure = ATTACK_FAILURE_VISIBILITY
  >= 50 → attack continues
```

If both sides are equally impaired the miss chance is waived.

### computeAttackBonus()

Sets `attack.attackBonus` from `getAttackBonus`:

```
attackBonus = base + typeBonus + specieBonus
```

- `base` — flat modifiers from `PROPERTY_ATTACK_MODIFIER` / `EFFECT_ATTACK_MODIFIER` with no subtype
- `typeBonus` — attack-type modifier (MELEE pre-seeded with BODY modifier, RANGED with SENSES modifier); finesse melee uses `max(MELEE, RANGED)`
- `specieBonus` — attack modifier keyed to the target's specie

### triggerAttackEvent / triggerAttackedEvent

Before hit resolution, the engine walks all active properties and effects on both creatures and fires their optional `attack` / `attacked` program hooks. This allows effects like rage, bless, or curse to modify `attack` fields (e.g. `attackBonus`, `ac`) at the last moment.

### computeHit()

Uses the pre-rolled `diceRoll` (rolled at construction):

| Roll | Outcome |
|---|---|
| `1` | `fumble = true`, `hit = false` — automatic miss |
| `20` | `critical = true`, `hit = true` — automatic hit |
| Other | `hit = (roll + attackBonus >= ac)` |

### computeDamages() — only on hit

```
amount = dice.roll(weapon.damageFormula)
if attackType === MELEE:
    amount += BODY modifier
    if two-handed or versatile-without-shield:
        amount += BODY modifier   (again)
if critical:
    amount *= 2
```

Ranged attacks do **not** add the BODY modifier. Critical hits double the final total (after ability bonuses). Each damage entry is pushed to `attack.damages` as `{ amount, damageType }`.

---

## Public fields

| Field | Type | Default | Description |
|---|---|---|---|
| `targetVisibility` | `CreatureVisibility` | `VISIBLE` | How the attacker perceives the target |
| `attackerVisibility` | `CreatureVisibility` | `VISIBLE` | How the target perceives the attacker |
| `weapon` | `Item \| null` | `null` | Weapon used (null until `initWeapon`) |
| `ammo` | `Item \| null` | `null` | Ammunition used |
| `attackType` | `AttackType` | `MELEE` | `ATTACK_TYPE_MELEE` or `ATTACK_TYPE_RANGED` |
| `range` | `number` | `0` | Max weapon range in units |
| `finesse` | `boolean` | `false` | Whether finesse ability selection applies |
| `offensiveAbility` | `Ability` | `ABILITY_BODY` | Ability used for the attack |
| `offensiveAbilityModifier` | `number` | `0` | Modifier of `offensiveAbility` |
| `ac` | `number` | `0` | Effective AC of the target |
| `attackBonus` | `number` | `0` | Total bonus added to the d20 roll |
| `roll` | `number` | *(rolled at construction)* | The raw d20 result |
| `fumble` | `boolean` | `false` | Natural 1 — automatic miss |
| `critical` | `boolean` | `false` | Natural 20 — automatic hit and double damage |
| `hit` | `boolean` | `false` | Whether the attack connected |
| `failed` | `boolean` | `false` | Whether the attack was aborted before resolution |
| `failure` | `string` | `''` | Reason code for failure (see below) |
| `damages` | `Damage[]` | `[]` | Damage entries `{ amount, damageType }` |
| `sneak` | `boolean` | `false` | Sneak attack flag (damage multiplier hook) |
| `opportunity` | `boolean` | `false` | Attack of opportunity flag |
| `rush` | `boolean` | `false` | Rush/charge attack flag |
| `improvised` | `boolean` | `false` | Improvised weapon flag |
| `lethal` | `boolean` | `false` | Set to true when the attack kills the target |
| `distance` | `number` | `0` | Distance between attacker and target |

---

## Failure codes

`attack.failed = true` and `attack.failure` is set to one of:

| Code | Meaning |
|---|---|
| `ATTACK_FAILURE_VISIBILITY` | 50% miss chance triggered against a hidden/invisible target |
| `ATTACK_FAILURE_NO_ACTION` | No action available |
| `ATTACK_FAILURE_TARGET_UNREACHABLE` | Target out of range |
| `ATTACK_FAILURE_CONDITION` | Attacker condition prevents attacking |
| `ATTACK_FAILURE_CHARMED` | Attacker is charmed toward the target |
| `ATTACK_FAILURE_FRIEND` | Target is a friend and friendly-fire is off |
| `ATTACK_FAILURE_DID_NOT_ATTACK` | Attack was skipped |
| `ATTACK_FAILURE_UNARMED` | No weapon and unarmed attacks are disallowed |
| `ATTACK_FAILURE_TARGET_DEAD` | Target was already dead |
