# Development History

## 2026-05-30
- Combat action economy: normal action slot (scripted action or weapon attack) + bonus action slot per round
- `attack()` marks `actionTaken`; `playRound` dispatches both slots via `getNormalOffensiveActionList` / `getBonusOffensiveActionList`

## 2026-05-29
- Manager public API switched from string IDs to `Item` instances; `_normalizeItem` resolves proxy/original mismatches
- New Manager helpers: innate property CRUD, effect apply/remove, deep-clone getters
- Combat system: `getMeleeWeaponList`, `getRangedWeaponList`, `getSuitableWeaponList`, `approach`/`retreat`, `playRound`
- `Attack.applyComputedDamages`: HP reduction, `damaged`/`damage` events, lethal flag
- `Orchestrator`: mirrored-combat creation, disposal, distance synchronisation

## 2026-05-28
- `CooldownManager`: multi-slot cooldown with configurable duration and charge count
- `Manager` class: creature/item registry, equipment lifecycle, ownership tracking, event forwarding
- Cursed item support and tests; `destroyItem` ownership cleanup fix
- `addItemProperty` / `removeItemProperty` on Manager

## 2026-05-27
- Immunity system: `EFFECT_IMMUNITY`, `PROPERTY_IMMUNITY`, `getImmunities`, effect rejection at application
- `EffectProgramPoison`, `getSpeed` getter, `PROPERTY_SPEED_FACTOR` (later removed)
- Action/cooldown schemas and distance library stubs
- Reference docs: vitals and conditions

## 2026-05-26
- Disease system: data files, schema, `EffectProgramDisease`, build script, full test suite
- Stage duration and subtype propagation; location registry refactor
- Size-aware base HP and AC loaded from data files; `getSize` getter
- Constants, enums, skills, and getters update pass

## 2026-05-22
- Charm: charmed attacker blocked from attacking charmer; breaks free when attacked
- Stealth contest moved from `getCreatureVisibility` into `Attack.initVisibility`
- Damage mitigation: `getDamageMitigation` getter, `DAMAGE_FACTOR` constants
- Effect amp typing (`z.number().int()`), property amp typing (`DiceExpression`), `resolveEffectAmp`/`resolvePropertyAmp` split
- `EffectProgramHeal` with `HealingFactor`/`HealingModifier`; mutation-over-time effect
- Skill-based resistance data and `getResistingSkill` utility; threat system removed
- `canMove`/`canFight`/`canAct` getters; Map-returning getters replaced with `Partial<Record>`
- Attack class documentation

## 2026-05-21
- `Attack` class fully implemented: hit resolution, critical/fumble, damage roll, visibility miss-chance
- `checkSkill` and `checkResistance` on Creature

## 2026-05-20
- Skills and resistances design doc and schema

## 2026-05-18
- `PropertyBuilder` and `ItemBuilder`
- Crossed ability modifiers wired up

## 2026-05-15
- Skill system: schema, constants, getter
- Crossed ability modifiers (initial)

## 2026-05-13
- Getter refinements; creature visibility fully tested

## 2026-05-12
- Additional properties, effects, and getters
- First `Attack` class skeleton; `getCreatureVisibility`

## 2026-05-11
- Creature state: properties, effects, and getters foundation

## 2026-05-07
- Code review and bug fixes

## 2026-05-04
- Constants/enum/schema restructuring continued
- First unit tests

## 2026-04-28
- Dependency update (`package-lock.json`)

## 2026-04-14 — 2026-04-15
- Project initialised; constants, enums, and schema structure laid out
