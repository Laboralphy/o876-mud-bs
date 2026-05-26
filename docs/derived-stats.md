# Derived Stats

Derived stats are computed from ability scores. All formulas are reactive — they update automatically when abilities, properties, or effects change.

---

## Ability modifier

All derived stats start from ability modifiers, not raw scores.

| Score | 1 | 2 | 4 | 6 | 8 | 10 | 12 | 14 | 16 | 18 | 20 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Modifier | −5 | −4 | −3 | −2 | −1 | 0 | +1 | +2 | +3 | +4 | +5 |

The default score for every ability is **10** (modifier 0).

---

## Hit Points

How much punishment a creature can absorb before dying. The baseline is generous — even a physically average creature starts with 20 HP — but a high BODY score scales it steeply, making physical conditioning the primary survival investment.

```
maxHP = BODY_modifier × 8 + 20
```

| BODY score | 10 | 12 | 14 | 16 | 18 |
|---|---|---|---|---|---|
| BODY modifier | 0 | +1 | +2 | +3 | +4 |
| Max HP | 20 | 28 | 36 | 44 | 52 |

`creature.hitPoints` is always clamped between `0` and `maxHP`.

Extra hit points can be added on top via `PROPERTY_EXTRA_HITPOINTS` or `EFFECT_EXTRA_HITPOINTS`.

---

## Armor Class

How hard a creature is to hit. SENSES dominates — quick, perceptive creatures are hard to land a blow on — while BODY contributes at half weight, reflecting that bulk and toughness make wounds glance but cannot fully substitute for evasion. Natural armor (hide, scales, worn equipment) adds on top of that baseline.

```
AC = 8 + SENSES_modifier + floor(BODY_modifier / 2) + naturalArmor
   + attackTypeBonus + specieBonus + damageTypeBonus
```

| Component | Source |
|---|---|
| `8` | Base constant (`ARMOR_CLASS_BASE_VALUE`) |
| `SENSES_modifier` | Reflexes / evasion |
| `floor(BODY_modifier / 2)` | Bulk / toughness (halved contribution) |
| `naturalArmor` | `state.armorClass` — set directly on the creature (natural hide, worn armor) |
| `attackTypeBonus` | `PROPERTY_ARMOR_CLASS_MODIFIER` / `EFFECT_ARMOR_CLASS_MODIFIER` scoped to a specific `attackType` |
| `specieBonus` | Same modifiers scoped to an attacker `specie` |
| `damageTypeBonus` | Same modifiers scoped to a `damageType`; hybrid weapons use `min(bonus1, bonus2)` |

**Example** — creature with SENSES 14 (+2), BODY 14 (+2), naturalArmor 2:

```
AC = 8 + 2 + floor(2/2) + 2 = 13
```

---

## Attack Bonus

How reliably a creature connects with its attacks. Melee accuracy is rooted in BODY — strength and muscle memory guiding the strike — while ranged accuracy relies on SENSES, the steady hand and sharp eye that put a shot where it needs to go. Finesse weapons let a quick fighter substitute SENSES for BODY in melee when their reflexes outpace their brawn.

The attack bonus is added to the `1d20` to-hit roll. It has three components:

```
attackBonus = base + typeBonus + specieBonus
```

| Component | Source |
|---|---|
| `base` | `PROPERTY_ATTACK_MODIFIER` / `EFFECT_ATTACK_MODIFIER` with no subtype |
| `typeBonus` | Per attack-type modifier, seeded from an ability (see below) |
| `specieBonus` | Attack modifier scoped to the target's `specie` |

### Type bonus by attack type

| Attack type | Ability seed | Finesse override |
|---|---|---|
| `ATTACK_TYPE_MELEE` | BODY modifier | `max(BODY, SENSES)` when weapon has `WEAPON_ATTRIBUTE_FINESSE` |
| `ATTACK_TYPE_RANGED` | SENSES modifier | No finesse effect |

The type bonus is the ability seed plus any `ATTACK_MODIFIER` effects/properties restricted to that attack type.

**Example** — melee attacker with BODY 14 (+2), no other modifiers:

```
attackBonus = 0 (base) + 2 (MELEE seeded from BODY) + 0 (specie) = +2
```

**Example** — ranged attacker with SENSES 16 (+3) and one `EFFECT_ATTACK_MODIFIER +2` for ranged:

```
attackBonus = 0 (base) + (3 + 2) (RANGED type bonus) + 0 (specie) = +5
```
