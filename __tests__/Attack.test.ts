import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Attack } from '../src/Attack';
import { Creature } from '../src/Creature';
import { CONSTS } from '../src/consts';
import { Dice } from '../src/libs/dice';
import { PropertyBuilder } from '../src/builders/PropertyBuilder';
import { LocationRegistry } from '../src/libs/locations/LocationRegistry';
import { makeWeapon, makeShield, makeAbilityModifierEffect } from './helpers/helpers';

function pushEffect(creature: Creature, type: string) {
    creature.state.effects.push(
        makeAbilityModifierEffect({ type } as Parameters<typeof makeAbilityModifierEffect>[0])
    );
}

// All Dice instances share the same prototype, so spying on it intercepts both the
// module-level dice inside DiceRoll (attack roll) and creature.dice (damage roll).
// mockReturnValueOnce queues values in call order: 1d20 first, then any subsequent rolls.

describe('Attack', () => {
    let attacker: Creature;
    let target: Creature;
    let registry: LocationRegistry;

    beforeEach(() => {
        registry = new LocationRegistry();
        attacker = new Creature('attacker');
        target = new Creature('target');
        const room = registry.defineLocation('room');
        room.addCreature(attacker);
        room.addCreature(target);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    // ─── initVisibility ───────────────────────────────────────────────────────

    describe('initVisibility', () => {
        it('both visible when no visibility effects are active', () => {
            const attack = new Attack(attacker, target);
            attack.initVisibility();
            expect(attack.targetVisibility).toBe(CONSTS.CREATURE_VISIBILITY_VISIBLE);
            expect(attack.attackerVisibility).toBe(CONSTS.CREATURE_VISIBILITY_VISIBLE);
        });

        it('target is hidden when stealth effect is active and the skill check succeeds', () => {
            // Attack constructor pre-rolls 1d20 for diceRoll; skill check needs 2 more rolls
            // roll order: [Attack.diceRoll, attacker STEALTH, target PERCEPTION]
            vi.spyOn(Dice.prototype, 'roll')
                .mockReturnValueOnce(10)  // Attack.diceRoll (consumed by constructor)
                .mockReturnValueOnce(15)  // attacker's STEALTH check
                .mockReturnValueOnce(5);  // target's PERCEPTION check → 15 >= 5 → HIDDEN
            pushEffect(target, CONSTS.EFFECT_STEALTH);
            const attack = new Attack(attacker, target);
            attack.initVisibility();
            expect(attack.targetVisibility).toBe(CONSTS.CREATURE_VISIBILITY_HIDDEN);
        });

        it('target is visible when stealth effect is active but the skill check fails', () => {
            // roll order: [Attack.diceRoll, attacker STEALTH, target PERCEPTION]
            vi.spyOn(Dice.prototype, 'roll')
                .mockReturnValueOnce(10)  // Attack.diceRoll (consumed by constructor)
                .mockReturnValueOnce(3)   // attacker's STEALTH check
                .mockReturnValueOnce(15); // target's PERCEPTION check → 3 < 15 → VISIBLE
            pushEffect(target, CONSTS.EFFECT_STEALTH);
            const attack = new Attack(attacker, target);
            attack.initVisibility();
            expect(attack.targetVisibility).toBe(CONSTS.CREATURE_VISIBILITY_VISIBLE);
        });

        it('targetVisibility is BLINDED when attacker has EFFECT_BLINDNESS', () => {
            pushEffect(attacker, CONSTS.EFFECT_BLINDNESS);
            const attack = new Attack(attacker, target);
            attack.initVisibility();
            expect(attack.targetVisibility).toBe(CONSTS.CREATURE_VISIBILITY_BLINDED);
        });
    });

    // ─── initWeapon ───────────────────────────────────────────────────────────

    describe('initWeapon', () => {
        it('defaults to melee, range 5, no finesse when unarmed', () => {
            vi.spyOn(Dice.prototype, 'roll').mockReturnValueOnce(10);
            const attack = new Attack(attacker, target);
            attack.initWeapon();
            expect(attack.attackType).toBe(CONSTS.ATTACK_TYPE_MELEE);
            expect(attack.range).toBe(5);
            expect(attack.finesse).toBe(false);
            expect(attack.weapon).not.toBeNull(); // falls back to NULL_WEAPON (1d2 crushing)
        });

        it('sets weapon reference from attacker equipment', () => {
            const weapon = makeWeapon();
            attacker.equipItem(weapon);
            vi.spyOn(Dice.prototype, 'roll').mockReturnValueOnce(10);
            const attack = new Attack(attacker, target);
            attack.initWeapon();
            expect(attack.weapon).not.toBeNull();
        });

        it('sets ranged attack type and range 100 for ranged weapon', () => {
            attacker.equipItem(
                makeWeapon({
                    attributes: [CONSTS.WEAPON_ATTRIBUTE_RANGED],
                    equipmentSlots: [CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED],
                })
            );
            attacker.state.selectedOffensiveSlot = CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED;
            vi.spyOn(Dice.prototype, 'roll').mockReturnValueOnce(10);
            const attack = new Attack(attacker, target);
            attack.initWeapon();
            expect(attack.attackType).toBe(CONSTS.ATTACK_TYPE_RANGED);
            expect(attack.range).toBe(100);
        });

        it('sets finesse flag for a finesse weapon', () => {
            attacker.equipItem(makeWeapon({ attributes: [CONSTS.WEAPON_ATTRIBUTE_FINESSE] }));
            vi.spyOn(Dice.prototype, 'roll').mockReturnValueOnce(10);
            const attack = new Attack(attacker, target);
            attack.initWeapon();
            expect(attack.finesse).toBe(true);
        });
    });

    // ─── initAbility ─────────────────────────────────────────────────────────

    describe('initAbility', () => {
        it('defaults to ABILITY_BODY with modifier 0', () => {
            vi.spyOn(Dice.prototype, 'roll').mockReturnValueOnce(10);
            const attack = new Attack(attacker, target);
            attack.initAbility();
            expect(attack.offensiveAbility).toBe(CONSTS.ABILITY_BODY);
            expect(attack.offensiveAbilityModifier).toBe(0);
        });

        it('stays ABILITY_BODY even when senses is higher and finesse is false', () => {
            attacker.state.abilities[CONSTS.ABILITY_SENSES] = 16; // mod +3
            attacker.state.abilities[CONSTS.ABILITY_BODY] = 10;   // mod  0
            vi.spyOn(Dice.prototype, 'roll').mockReturnValueOnce(10);
            const attack = new Attack(attacker, target);
            attack.finesse = false;
            attack.initAbility();
            expect(attack.offensiveAbility).toBe(CONSTS.ABILITY_BODY);
            expect(attack.offensiveAbilityModifier).toBe(0);
        });

        it('switches to ABILITY_SENSES when finesse is true and senses modifier > body modifier', () => {
            attacker.state.abilities[CONSTS.ABILITY_SENSES] = 16; // mod +3
            attacker.state.abilities[CONSTS.ABILITY_BODY] = 10;   // mod  0
            vi.spyOn(Dice.prototype, 'roll').mockReturnValueOnce(10);
            const attack = new Attack(attacker, target);
            attack.finesse = true;
            attack.initAbility();
            expect(attack.offensiveAbility).toBe(CONSTS.ABILITY_SENSES);
            expect(attack.offensiveAbilityModifier).toBe(3);
        });

        it('keeps ABILITY_BODY when finesse is true but body modifier >= senses modifier', () => {
            attacker.state.abilities[CONSTS.ABILITY_BODY] = 14;   // mod +2
            attacker.state.abilities[CONSTS.ABILITY_SENSES] = 10; // mod  0
            vi.spyOn(Dice.prototype, 'roll').mockReturnValueOnce(10);
            const attack = new Attack(attacker, target);
            attack.finesse = true;
            attack.initAbility();
            expect(attack.offensiveAbility).toBe(CONSTS.ABILITY_BODY);
            expect(attack.offensiveAbilityModifier).toBe(2);
        });
    });

    // ─── initTarget ──────────────────────────────────────────────────────────

    describe('initTarget', () => {
        it('sets AC to base value (8) when target has no modifiers', () => {
            // ARMOR_CLASS_BASE_VALUE(8) + senses_mod(0) + floor(body_mod/2)(0) + armorClass(0) = 8
            vi.spyOn(Dice.prototype, 'roll').mockReturnValueOnce(10);
            const attack = new Attack(attacker, target);
            attack.initWeapon();
            attack.initTarget();
            expect(attack.ac).toBe(8);
        });

        it('includes target natural armorClass', () => {
            target.state.armorClass = 4;
            vi.spyOn(Dice.prototype, 'roll').mockReturnValueOnce(10);
            const attack = new Attack(attacker, target);
            attack.initWeapon();
            attack.initTarget();
            expect(attack.ac).toBe(12); // 8 + 4
        });

        it('adds attack-type AC bonus from target properties', () => {
            target.state.properties.push(
                PropertyBuilder.buildProperty({
                    type: CONSTS.PROPERTY_ARMOR_CLASS_MODIFIER,
                    amp: 3,
                    attackType: CONSTS.ATTACK_TYPE_MELEE,
                })
            );
            vi.spyOn(Dice.prototype, 'roll').mockReturnValueOnce(10);
            const attack = new Attack(attacker, target);
            attack.initWeapon(); // attackType = MELEE
            attack.initTarget();
            expect(attack.ac).toBe(11); // 8 + 3
        });

        it('adds specie-specific AC bonus from target properties', () => {
            target.state.properties.push(
                PropertyBuilder.buildProperty({
                    type: CONSTS.PROPERTY_ARMOR_CLASS_MODIFIER,
                    amp: 2,
                    specie: CONSTS.SPECIE_HUMANOID, // target default specie
                })
            );
            vi.spyOn(Dice.prototype, 'roll').mockReturnValueOnce(10);
            const attack = new Attack(attacker, target);
            attack.initWeapon();
            attack.initTarget();
            expect(attack.ac).toBe(10); // 8 + 2
        });

        it('adds damage-type AC bonus for a single-type weapon', () => {
            attacker.equipItem(makeWeapon({ damageType: CONSTS.DAMAGE_TYPE_SLASHING }));
            target.state.properties.push(
                PropertyBuilder.buildProperty({
                    type: CONSTS.PROPERTY_ARMOR_CLASS_MODIFIER,
                    amp: 4,
                    damageType: CONSTS.DAMAGE_TYPE_SLASHING,
                })
            );
            vi.spyOn(Dice.prototype, 'roll').mockReturnValueOnce(10);
            const attack = new Attack(attacker, target);
            attack.initWeapon();
            attack.initTarget();
            expect(attack.ac).toBe(12); // 8 + 4
        });

        it('hybrid weapon exploits weaker defense — uses Math.min of two damage-type bonuses', () => {
            attacker.equipItem(
                makeWeapon({
                    damageType: CONSTS.DAMAGE_TYPE_SLASHING,
                    altDamageType: CONSTS.DAMAGE_TYPE_PIERCING,
                })
            );
            target.state.properties.push(
                PropertyBuilder.buildProperty({
                    type: CONSTS.PROPERTY_ARMOR_CLASS_MODIFIER,
                    amp: 4,
                    damageType: CONSTS.DAMAGE_TYPE_SLASHING,
                })
            );
            target.state.properties.push(
                PropertyBuilder.buildProperty({
                    type: CONSTS.PROPERTY_ARMOR_CLASS_MODIFIER,
                    amp: 1,
                    damageType: CONSTS.DAMAGE_TYPE_PIERCING,
                })
            );
            vi.spyOn(Dice.prototype, 'roll').mockReturnValueOnce(10);
            const attack = new Attack(attacker, target);
            attack.initWeapon();
            attack.initTarget();
            expect(attack.ac).toBe(9); // 8 + min(4, 1) = 8 + 1
        });

        it('unarmed attack uses crushing damage type for the AC lookup', () => {
            target.state.properties.push(
                PropertyBuilder.buildProperty({
                    type: CONSTS.PROPERTY_ARMOR_CLASS_MODIFIER,
                    amp: 3,
                    damageType: CONSTS.DAMAGE_TYPE_CRUSHING,
                })
            );
            vi.spyOn(Dice.prototype, 'roll').mockReturnValueOnce(10);
            const attack = new Attack(attacker, target);
            attack.initWeapon(); // no weapon → unarmed → crushing
            attack.initTarget();
            expect(attack.ac).toBe(11); // 8 + 3
        });
    });

    // ─── computeAttackBonus ───────────────────────────────────────────────────

    describe('computeAttackBonus', () => {
        it('sets 0 attack bonus with average abilities and no modifiers', () => {
            vi.spyOn(Dice.prototype, 'roll').mockReturnValueOnce(10);
            const attack = new Attack(attacker, target);
            attack.attackType = CONSTS.ATTACK_TYPE_MELEE;
            attack.computeAttackBonus();
            expect(attack.attackBonus).toBe(0);
        });

        it('applies Body modifier to melee attack bonus', () => {
            attacker.state.abilities[CONSTS.ABILITY_BODY] = 14; // mod +2
            vi.spyOn(Dice.prototype, 'roll').mockReturnValueOnce(10);
            const attack = new Attack(attacker, target);
            attack.attackType = CONSTS.ATTACK_TYPE_MELEE;
            attack.computeAttackBonus();
            expect(attack.attackBonus).toBe(2);
        });

        it('applies Senses modifier to ranged attack bonus', () => {
            attacker.state.abilities[CONSTS.ABILITY_SENSES] = 16; // mod +3
            vi.spyOn(Dice.prototype, 'roll').mockReturnValueOnce(10);
            const attack = new Attack(attacker, target);
            attack.attackType = CONSTS.ATTACK_TYPE_RANGED;
            attack.computeAttackBonus();
            expect(attack.attackBonus).toBe(3);
        });

        it('uses best of Body or Senses bonus for finesse melee attacks', () => {
            attacker.state.abilities[CONSTS.ABILITY_BODY] = 10;   // mod  0
            attacker.state.abilities[CONSTS.ABILITY_SENSES] = 14; // mod +2
            vi.spyOn(Dice.prototype, 'roll').mockReturnValueOnce(10);
            const attack = new Attack(attacker, target);
            attack.finesse = true;
            attack.attackType = CONSTS.ATTACK_TYPE_MELEE;
            attack.computeAttackBonus();
            expect(attack.attackBonus).toBe(2); // max(0, 2)
        });

        it('finesse does not apply to ranged attacks', () => {
            attacker.state.abilities[CONSTS.ABILITY_BODY] = 14;   // mod +2
            attacker.state.abilities[CONSTS.ABILITY_SENSES] = 10; // mod  0
            vi.spyOn(Dice.prototype, 'roll').mockReturnValueOnce(10);
            const attack = new Attack(attacker, target);
            attack.finesse = true;
            attack.attackType = CONSTS.ATTACK_TYPE_RANGED;
            attack.computeAttackBonus();
            expect(attack.attackBonus).toBe(0); // ranged always uses senses
        });

        it('adds species-specific bonus when target specie matches', () => {
            attacker.state.properties.push(
                PropertyBuilder.buildProperty({
                    type: CONSTS.PROPERTY_ATTACK_MODIFIER,
                    amp: 3,
                    specie: CONSTS.SPECIE_HUMANOID, // target default specie
                })
            );
            vi.spyOn(Dice.prototype, 'roll').mockReturnValueOnce(10);
            const attack = new Attack(attacker, target);
            attack.attackType = CONSTS.ATTACK_TYPE_MELEE;
            attack.computeAttackBonus();
            expect(attack.attackBonus).toBe(3);
        });
    });

    // ─── computeHit ──────────────────────────────────────────────────────────

    describe('computeHit', () => {
        it('roll of 1 is a fumble and forces a miss', () => {
            vi.spyOn(Dice.prototype, 'roll').mockReturnValueOnce(1);
            const attack = new Attack(attacker, target);
            attack.ac = 5; // would normally hit
            attack.computeHit();
            expect(attack.fumble).toBe(true);
            expect(attack.hit).toBe(false);
        });

        it('roll of 20 is a critical and forces a hit regardless of AC', () => {
            vi.spyOn(Dice.prototype, 'roll').mockReturnValueOnce(20);
            const attack = new Attack(attacker, target);
            attack.ac = 100;
            attack.computeHit();
            expect(attack.critical).toBe(true);
            expect(attack.hit).toBe(true);
        });

        it('hits when total meets AC exactly', () => {
            vi.spyOn(Dice.prototype, 'roll').mockReturnValueOnce(12);
            const attack = new Attack(attacker, target);
            attack.attackBonus = 3; // total = 15
            attack.ac = 15;
            attack.computeHit();
            expect(attack.hit).toBe(true);
            expect(attack.fumble).toBe(false);
            expect(attack.critical).toBe(false);
        });

        it('misses when total falls below AC', () => {
            vi.spyOn(Dice.prototype, 'roll').mockReturnValueOnce(8);
            const attack = new Attack(attacker, target);
            attack.attackBonus = 0; // total = 8
            attack.ac = 15;
            attack.computeHit();
            expect(attack.hit).toBe(false);
            expect(attack.fumble).toBe(false);
        });
    });

    // ─── computeVisibility ───────────────────────────────────────────────────

    describe('computeVisibility', () => {
        it('no miss chance when target is visible', () => {
            vi.spyOn(Dice.prototype, 'roll').mockReturnValueOnce(10);
            const attack = new Attack(attacker, target);
            attack.computeVisibility();
            expect(attack.failed).toBe(false);
        });

        it('no miss chance when both attacker and target are impaired', () => {
            vi.spyOn(Dice.prototype, 'roll').mockReturnValueOnce(10);
            const attack = new Attack(attacker, target);
            attack.targetVisibility = CONSTS.CREATURE_VISIBILITY_HIDDEN;
            attack.attackerVisibility = CONSTS.CREATURE_VISIBILITY_HIDDEN;
            attack.computeVisibility();
            expect(attack.failed).toBe(false);
        });

        it('misses when target not visible and visibility roll fails (< 50)', () => {
            vi.spyOn(Dice.prototype, 'roll')
                .mockReturnValueOnce(10) // 1d20
                .mockReturnValueOnce(30); // 1d100 < 50 → fail
            const attack = new Attack(attacker, target);
            attack.targetVisibility = CONSTS.CREATURE_VISIBILITY_INVISIBLE;
            attack.attackerVisibility = CONSTS.CREATURE_VISIBILITY_VISIBLE;
            attack.computeVisibility();
            expect(attack.failed).toBe(true);
            expect(attack.failure).toBe(CONSTS.ATTACK_FAILURE_VISIBILITY);
        });

        it('does not miss when target not visible but visibility roll succeeds (>= 50)', () => {
            vi.spyOn(Dice.prototype, 'roll')
                .mockReturnValueOnce(10) // 1d20
                .mockReturnValueOnce(60); // 1d100 >= 50 → success
            const attack = new Attack(attacker, target);
            attack.targetVisibility = CONSTS.CREATURE_VISIBILITY_HIDDEN;
            attack.attackerVisibility = CONSTS.CREATURE_VISIBILITY_VISIBLE;
            attack.computeVisibility();
            expect(attack.failed).toBe(false);
        });
    });

    // ─── computeDamages ──────────────────────────────────────────────────────

    describe('computeDamages', () => {
        it('unarmed attack deals 1d2 crushing damage', () => {
            vi.spyOn(Dice.prototype, 'roll')
                .mockReturnValueOnce(10) // 1d20
                .mockReturnValueOnce(2); // 1d2
            const attack = new Attack(attacker, target);
            attack.initWeapon(); // sets weapon to NULL_WEAPON (1d2 crushing)
            attack.computeDamages();
            expect(attack.damages).toHaveLength(1);
            expect(attack.damages[0].amount).toBe(2);
            expect(attack.damages[0].damageType).toBe(CONSTS.DAMAGE_TYPE_CRUSHING);
        });

        it('uses weapon damage formula and damage type', () => {
            attacker.equipItem(
                makeWeapon({ damages: '1d8', damageType: CONSTS.DAMAGE_TYPE_SLASHING })
            );
            vi.spyOn(Dice.prototype, 'roll')
                .mockReturnValueOnce(10) // 1d20
                .mockReturnValueOnce(6); // 1d8
            const attack = new Attack(attacker, target);
            attack.initWeapon();
            attack.computeDamages();
            expect(attack.damages[0].amount).toBe(6);
            expect(attack.damages[0].damageType).toBe(CONSTS.DAMAGE_TYPE_SLASHING);
        });

        it('doubles damage on a critical hit', () => {
            vi.spyOn(Dice.prototype, 'roll')
                .mockReturnValueOnce(10) // 1d20
                .mockReturnValueOnce(5); // damage roll
            const attack = new Attack(attacker, target);
            attack.initWeapon();
            attack.critical = true;
            attack.computeDamages();
            expect(attack.damages[0].amount).toBe(10); // 5 × 2
        });

        it('does not double damage on a normal hit', () => {
            vi.spyOn(Dice.prototype, 'roll')
                .mockReturnValueOnce(10) // 1d20
                .mockReturnValueOnce(5); // damage roll
            const attack = new Attack(attacker, target);
            attack.initWeapon();
            attack.critical = false;
            attack.computeDamages();
            expect(attack.damages[0].amount).toBe(5);
        });

        it('adds body modifier once for a normal melee weapon', () => {
            attacker.state.abilities[CONSTS.ABILITY_BODY] = 14; // mod +2
            attacker.equipItem(makeWeapon({ damages: '1d8' }));
            vi.spyOn(Dice.prototype, 'roll')
                .mockReturnValueOnce(10) // 1d20
                .mockReturnValueOnce(4); // 1d8
            const attack = new Attack(attacker, target);
            attack.initWeapon();
            attack.initAbility();
            attack.computeDamages();
            expect(attack.damages[0].amount).toBe(6); // 4 + 2
        });

        it('adds body modifier twice for a two-handed melee weapon', () => {
            attacker.state.abilities[CONSTS.ABILITY_BODY] = 14; // mod +2
            attacker.equipItem(
                makeWeapon({
                    damages: '1d10',
                    attributes: [CONSTS.WEAPON_ATTRIBUTE_TWO_HANDED],
                })
            );
            vi.spyOn(Dice.prototype, 'roll')
                .mockReturnValueOnce(10) // 1d20
                .mockReturnValueOnce(5); // 1d10
            const attack = new Attack(attacker, target);
            attack.initWeapon();
            attack.initAbility();
            attack.computeDamages();
            expect(attack.damages[0].amount).toBe(9); // 5 + 2 + 2
        });

        it('adds body modifier twice for a versatile weapon wielded without shield', () => {
            attacker.state.abilities[CONSTS.ABILITY_BODY] = 14; // mod +2
            attacker.equipItem(
                makeWeapon({
                    damages: '1d8',
                    attributes: [CONSTS.WEAPON_ATTRIBUTE_VERSATILE],
                })
            );
            vi.spyOn(Dice.prototype, 'roll')
                .mockReturnValueOnce(10) // 1d20
                .mockReturnValueOnce(5); // 1d8
            const attack = new Attack(attacker, target);
            attack.initWeapon();
            attack.initAbility();
            attack.computeDamages();
            expect(attack.damages[0].amount).toBe(9); // 5 + 2 + 2
        });

        it('adds body modifier only once for a versatile weapon when a shield is equipped', () => {
            attacker.state.abilities[CONSTS.ABILITY_BODY] = 14; // mod +2
            attacker.equipItem(
                makeWeapon({
                    damages: '1d8',
                    attributes: [CONSTS.WEAPON_ATTRIBUTE_VERSATILE],
                })
            );
            attacker.equipItem(makeShield());
            vi.spyOn(Dice.prototype, 'roll')
                .mockReturnValueOnce(10) // 1d20
                .mockReturnValueOnce(5); // 1d8
            const attack = new Attack(attacker, target);
            attack.initWeapon();
            attack.initAbility();
            attack.computeDamages();
            expect(attack.damages[0].amount).toBe(7); // 5 + 2 (shield blocks two-hand grip)
        });

        it('does not add body modifier to ranged attacks', () => {
            attacker.state.abilities[CONSTS.ABILITY_BODY] = 16; // mod +3
            attacker.equipItem(
                makeWeapon({
                    damages: '1d6',
                    attributes: [CONSTS.WEAPON_ATTRIBUTE_RANGED],
                    equipmentSlots: [CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED],
                })
            );
            attacker.state.selectedOffensiveSlot = CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED;
            vi.spyOn(Dice.prototype, 'roll')
                .mockReturnValueOnce(10) // 1d20
                .mockReturnValueOnce(4); // 1d6
            const attack = new Attack(attacker, target);
            attack.initWeapon();
            attack.initAbility();
            attack.computeDamages();
            expect(attack.damages[0].amount).toBe(4); // body mod not added to ranged
        });
    });

    // ─── run (integration) ───────────────────────────────────────────────────

    describe('run', () => {
        it('stops early on visibility miss — no damage, no attack bonus set', () => {
            vi.spyOn(Dice.prototype, 'roll')
                .mockReturnValueOnce(15) // 1d20
                .mockReturnValueOnce(20); // 1d100 < 50 → visibility fail
            const attack = new Attack(attacker, target);
            attack.targetVisibility = CONSTS.CREATURE_VISIBILITY_HIDDEN;
            attack.attackerVisibility = CONSTS.CREATURE_VISIBILITY_VISIBLE;
            attack.run();
            expect(attack.failed).toBe(true);
            expect(attack.damages).toHaveLength(0);
        });

        it('populates damages on a successful hit', () => {
            attacker.equipItem(makeWeapon({ damages: '1d8' }));
            vi.spyOn(Dice.prototype, 'roll')
                .mockReturnValueOnce(15) // 1d20 → 15 >= AC 8 → hit
                .mockReturnValueOnce(6); // 1d8 damage
            const attack = new Attack(attacker, target);
            attack.init();
            attack.run();
            expect(attack.hit).toBe(true);
            expect(attack.damages).toHaveLength(1);
            expect(attack.damages[0].amount).toBe(6);
        });

        it('produces no damages on a miss', () => {
            vi.spyOn(Dice.prototype, 'roll').mockReturnValueOnce(2); // total 2 < AC 8
            const attack = new Attack(attacker, target);
            attack.init();
            attack.run();
            expect(attack.hit).toBe(false);
            expect(attack.damages).toHaveLength(0);
        });

        it('fumble produces no damages', () => {
            vi.spyOn(Dice.prototype, 'roll').mockReturnValueOnce(1);
            const attack = new Attack(attacker, target);
            attack.init();
            attack.run();
            expect(attack.fumble).toBe(true);
            expect(attack.damages).toHaveLength(0);
        });

        it('critical hit doubles damage', () => {
            attacker.equipItem(makeWeapon({ damages: '1d8' }));
            vi.spyOn(Dice.prototype, 'roll')
                .mockReturnValueOnce(20) // critical
                .mockReturnValueOnce(4); // 1d8 damage
            const attack = new Attack(attacker, target);
            attack.init();
            attack.run();
            expect(attack.critical).toBe(true);
            expect(attack.damages[0].amount).toBe(8); // 4 × 2
        });

        it('fails immediately with ATTACK_FAILURE_CHARMED when attacker is charmed by target', () => {
            attacker.state.effects.push({
                id: 'charm-1',
                type: CONSTS.EFFECT_CHARM,
                subtype: CONSTS.EFFECT_SUBTYPE_MAGICAL,
                duration: 10,
                target: attacker.id,
                source: target.id,
                siblings: [],
                tag: '',
                data: { type: CONSTS.EFFECT_CHARM },
            });
            const attack = new Attack(attacker, target);
            attack.init();
            attack.run();
            expect(attack.failed).toBe(true);
            expect(attack.failure).toBe(CONSTS.ATTACK_FAILURE_CHARMED);
            expect(attack.damages).toHaveLength(0);
        });

        it('does not block attack when charmed by a different creature', () => {
            attacker.state.effects.push({
                id: 'charm-1',
                type: CONSTS.EFFECT_CHARM,
                subtype: CONSTS.EFFECT_SUBTYPE_MAGICAL,
                duration: 10,
                target: attacker.id,
                source: 'some-other-creature',
                siblings: [],
                tag: '',
                data: { type: CONSTS.EFFECT_CHARM },
            });
            vi.spyOn(Dice.prototype, 'roll').mockReturnValueOnce(15);
            const attack = new Attack(attacker, target);
            attack.init();
            attack.run();
            expect(attack.failed).toBe(false);
        });
    });
});
