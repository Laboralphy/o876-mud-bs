import { describe, it, expect, beforeEach } from 'vitest';
import { Creature } from '../../src/Creature';
import { CONSTS } from '../../src/consts';
import { VARS } from '../../src/vars';

describe('getAbilities', () => {
    let creature: Creature;

    beforeEach(() => {
        creature = new Creature('test');
    });

    it('returns base ability values when there are no bonuses', () => {
        const abilities = creature.getters.getAbilities;
        expect(abilities[CONSTS.ABILITY_BODY]).toBe(10);
        expect(abilities[CONSTS.ABILITY_SENSE]).toBe(10);
        expect(abilities[CONSTS.ABILITY_MIND]).toBe(10);
        expect(abilities[CONSTS.ABILITY_PRESENCE]).toBe(10);
    });

    it('reflects a modified base ability', () => {
        creature.state.abilities[CONSTS.ABILITY_BODY] = 16;
        expect(creature.getters.getAbilities[CONSTS.ABILITY_BODY]).toBe(16);
    });

    it('each ability is independent', () => {
        creature.state.abilities[CONSTS.ABILITY_BODY] = 8;
        creature.state.abilities[CONSTS.ABILITY_SENSE] = 14;
        const abilities = creature.getters.getAbilities;
        expect(abilities[CONSTS.ABILITY_BODY]).toBe(8);
        expect(abilities[CONSTS.ABILITY_SENSE]).toBe(14);
        expect(abilities[CONSTS.ABILITY_MIND]).toBe(10);
        expect(abilities[CONSTS.ABILITY_PRESENCE]).toBe(10);
    });
});

describe('getAbilityModifiers', () => {
    let creature: Creature;

    beforeEach(() => {
        creature = new Creature('test');
    });

    it('returns 0 for ability score of 10', () => {
        expect(creature.getters.getAbilityModifiers[CONSTS.ABILITY_BODY]).toBe(0);
    });

    it('returns 0 for ability score of 11', () => {
        creature.state.abilities[CONSTS.ABILITY_BODY] = 11;
        expect(creature.getters.getAbilityModifiers[CONSTS.ABILITY_BODY]).toBe(0);
    });

    it('returns positive modifier for score above 10', () => {
        creature.state.abilities[CONSTS.ABILITY_BODY] = 14;
        expect(creature.getters.getAbilityModifiers[CONSTS.ABILITY_BODY]).toBe(2);
    });

    it('returns negative modifier for score below 10', () => {
        creature.state.abilities[CONSTS.ABILITY_BODY] = 8;
        expect(creature.getters.getAbilityModifiers[CONSTS.ABILITY_BODY]).toBe(-1);
    });

    it('returns 5 for ability score of 20', () => {
        creature.state.abilities[CONSTS.ABILITY_BODY] = 20;
        expect(creature.getters.getAbilityModifiers[CONSTS.ABILITY_BODY]).toBe(5);
    });

    it('computes all abilities independently', () => {
        creature.state.abilities[CONSTS.ABILITY_BODY] = 12;
        creature.state.abilities[CONSTS.ABILITY_SENSE] = 8;
        creature.state.abilities[CONSTS.ABILITY_MIND] = 20;
        creature.state.abilities[CONSTS.ABILITY_PRESENCE] = 10;
        const mods = creature.getters.getAbilityModifiers;
        expect(mods[CONSTS.ABILITY_BODY]).toBe(1);
        expect(mods[CONSTS.ABILITY_SENSE]).toBe(-1);
        expect(mods[CONSTS.ABILITY_MIND]).toBe(5);
        expect(mods[CONSTS.ABILITY_PRESENCE]).toBe(0);
    });
});

describe('getMaxHitPoints', () => {
    let creature: Creature;

    beforeEach(() => {
        creature = new Creature('test');
    });

    it('returns base + body*hpPerBody at default score of 10', () => {
        expect(creature.getters.getMaxHitPoints).toBe(
            10 * VARS.HITPOINTS_PER_BODY + VARS.HITPOINTS_BASE_VALUE
        );
    });

    it('increases with higher body score', () => {
        creature.state.abilities[CONSTS.ABILITY_BODY] = 18;
        expect(creature.getters.getMaxHitPoints).toBe(
            18 * VARS.HITPOINTS_PER_BODY + VARS.HITPOINTS_BASE_VALUE
        );
    });

    it('decreases with lower body score', () => {
        creature.state.abilities[CONSTS.ABILITY_BODY] = 4;
        expect(creature.getters.getMaxHitPoints).toBe(
            4 * VARS.HITPOINTS_PER_BODY + VARS.HITPOINTS_BASE_VALUE
        );
    });

    it('is not affected by other abilities', () => {
        creature.state.abilities[CONSTS.ABILITY_SENSE] = 20;
        creature.state.abilities[CONSTS.ABILITY_MIND] = 20;
        expect(creature.getters.getMaxHitPoints).toBe(
            10 * VARS.HITPOINTS_PER_BODY + VARS.HITPOINTS_BASE_VALUE
        );
    });
});

describe('getArmorClass', () => {
    let creature: Creature;

    beforeEach(() => {
        creature = new Creature('test');
    });

    it('returns base AC when sense modifier is 0', () => {
        // SENSE=10 → modifier=0 → AC = 8 + 0 + 0 = 8
        expect(creature.getters.getArmorClass).toBe(VARS.ARMOR_CLASS_BASE_VALUE);
    });

    it('increases with positive sense modifier', () => {
        // SENSE=14 → modifier=2 → AC = 8 + 2 + 1 = 11
        creature.state.abilities[CONSTS.ABILITY_SENSE] = 14;
        expect(creature.getters.getArmorClass).toBe(VARS.ARMOR_CLASS_BASE_VALUE + 2 + 1);
    });

    it('decreases with negative sense modifier', () => {
        // SENSE=8 → modifier=-1 → AC = 8 + (-1) + floor(-0.5) = 8 - 1 - 1 = 6
        creature.state.abilities[CONSTS.ABILITY_SENSE] = 8;
        expect(creature.getters.getArmorClass).toBe(VARS.ARMOR_CLASS_BASE_VALUE - 1 - 1);
    });

    it('is not affected by body ability', () => {
        creature.state.abilities[CONSTS.ABILITY_BODY] = 20;
        expect(creature.getters.getArmorClass).toBe(VARS.ARMOR_CLASS_BASE_VALUE);
    });
});
