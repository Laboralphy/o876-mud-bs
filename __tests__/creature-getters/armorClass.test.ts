import { describe, it, expect, beforeEach } from 'vitest';
import { Creature } from '../../src/Creature';
import { CONSTS } from '../../src/consts';
import { VARS } from '../../src/vars';
import { Property } from '../../src/properties/schemas';

function addAC(
    creature: Creature,
    amp: number,
    options: {
        attackType?: string;
        damageType?: string;
        specie?: string;
    } = {}
) {
    creature.addInnateProperty({
        type: CONSTS.PROPERTY_ARMOR_CLASS_MODIFIER,
        amp,
        ...options,
    } as Property);
}

describe('getArmorClass - base', () => {
    let creature: Creature;

    beforeEach(() => {
        creature = new Creature('test');
    });

    it('returns base AC from abilities alone at default scores', () => {
        // SENSES=10 → mod=0, BODY=10 → mod=0 → base = ARMOR_CLASS_BASE_VALUE
        expect(creature.getters.getArmorClass.base).toBe(VARS.ARMOR_CLASS_BASE_VALUE);
    });

    it('adds sense modifier to base', () => {
        creature.state.abilities[CONSTS.ABILITY_SENSES] = 14; // mod=+2
        expect(creature.getters.getArmorClass.base).toBe(VARS.ARMOR_CLASS_BASE_VALUE + 2);
    });

    it('adds half body modifier (floored) to base', () => {
        creature.state.abilities[CONSTS.ABILITY_BODY] = 14; // mod=+2 → floor(2/2)=1
        expect(creature.getters.getArmorClass.base).toBe(VARS.ARMOR_CLASS_BASE_VALUE + 1);
    });

    it('adds natural armor class (state.armorClass) to base', () => {
        creature.state.armorClass = 3;
        expect(creature.getters.getArmorClass.base).toBe(VARS.ARMOR_CLASS_BASE_VALUE + 3);
    });

    it('combines ability modifiers and natural armor in base', () => {
        creature.state.abilities[CONSTS.ABILITY_SENSES] = 14; // +2
        creature.state.abilities[CONSTS.ABILITY_BODY] = 16; // mod=+3 → floor(3/2)=1
        creature.state.armorClass = 2;
        expect(creature.getters.getArmorClass.base).toBe(VARS.ARMOR_CLASS_BASE_VALUE + 2 + 1 + 2);
    });
});

describe('getArmorClass - attackTypes', () => {
    let creature: Creature;

    beforeEach(() => {
        creature = new Creature('test');
    });

    it('returns an empty map when there are no AC modifier properties', () => {
        expect(creature.getters.getArmorClass.attackTypes.size).toBe(0);
    });

    it('records a melee AC bonus from an innate property', () => {
        addAC(creature, 3, { attackType: CONSTS.ATTACK_TYPE_MELEE });
        expect(creature.getters.getArmorClass.attackTypes.get(CONSTS.ATTACK_TYPE_MELEE)).toBe(3);
    });

    it('records a ranged AC bonus from an innate property', () => {
        addAC(creature, 2, { attackType: CONSTS.ATTACK_TYPE_RANGED });
        expect(creature.getters.getArmorClass.attackTypes.get(CONSTS.ATTACK_TYPE_RANGED)).toBe(2);
    });

    it('stacks multiple properties of the same attack type', () => {
        addAC(creature, 2, { attackType: CONSTS.ATTACK_TYPE_MELEE });
        addAC(creature, 3, { attackType: CONSTS.ATTACK_TYPE_MELEE });
        expect(creature.getters.getArmorClass.attackTypes.get(CONSTS.ATTACK_TYPE_MELEE)).toBe(5);
    });

    it('tracks different attack types independently', () => {
        addAC(creature, 4, { attackType: CONSTS.ATTACK_TYPE_MELEE });
        addAC(creature, 1, { attackType: CONSTS.ATTACK_TYPE_RANGED });
        const ac = creature.getters.getArmorClass;
        expect(ac.attackTypes.get(CONSTS.ATTACK_TYPE_MELEE)).toBe(4);
        expect(ac.attackTypes.get(CONSTS.ATTACK_TYPE_RANGED)).toBe(1);
    });
});

describe('getArmorClass - damageTypes', () => {
    let creature: Creature;

    beforeEach(() => {
        creature = new Creature('test');
    });

    it('returns an empty map when there are no AC modifier properties', () => {
        expect(creature.getters.getArmorClass.damageTypes.size).toBe(0);
    });

    it('records a thermal damage AC bonus', () => {
        addAC(creature, 5, { damageType: CONSTS.DAMAGE_TYPE_THERMAL });
        expect(creature.getters.getArmorClass.damageTypes.get(CONSTS.DAMAGE_TYPE_THERMAL)).toBe(5);
    });

    it('stacks multiple properties of the same damage type', () => {
        addAC(creature, 2, { damageType: CONSTS.DAMAGE_TYPE_ELECTRIC });
        addAC(creature, 3, { damageType: CONSTS.DAMAGE_TYPE_ELECTRIC });
        expect(creature.getters.getArmorClass.damageTypes.get(CONSTS.DAMAGE_TYPE_ELECTRIC)).toBe(5);
    });

    it('tracks different damage types independently', () => {
        addAC(creature, 3, { damageType: CONSTS.DAMAGE_TYPE_THERMAL });
        addAC(creature, 2, { damageType: CONSTS.DAMAGE_TYPE_CRYOGENIC });
        const ac = creature.getters.getArmorClass;
        expect(ac.damageTypes.get(CONSTS.DAMAGE_TYPE_THERMAL)).toBe(3);
        expect(ac.damageTypes.get(CONSTS.DAMAGE_TYPE_CRYOGENIC)).toBe(2);
    });
});

describe('getArmorClass - species', () => {
    let creature: Creature;

    beforeEach(() => {
        creature = new Creature('test');
    });

    it('returns an empty map when there are no AC modifier properties', () => {
        expect(creature.getters.getArmorClass.species.size).toBe(0);
    });

    it('records an AC bonus against a specific specie', () => {
        addAC(creature, 4, { specie: CONSTS.SPECIE_DRAGON });
        expect(creature.getters.getArmorClass.species.get(CONSTS.SPECIE_DRAGON)).toBe(4);
    });

    it('stacks multiple properties against the same specie', () => {
        addAC(creature, 2, { specie: CONSTS.SPECIE_UNDEAD });
        addAC(creature, 3, { specie: CONSTS.SPECIE_UNDEAD });
        expect(creature.getters.getArmorClass.species.get(CONSTS.SPECIE_UNDEAD)).toBe(5);
    });

    it('tracks bonuses against different species independently', () => {
        addAC(creature, 3, { specie: CONSTS.SPECIE_DRAGON });
        addAC(creature, 1, { specie: CONSTS.SPECIE_HUMANOID });
        const ac = creature.getters.getArmorClass;
        expect(ac.species.get(CONSTS.SPECIE_DRAGON)).toBe(3);
        expect(ac.species.get(CONSTS.SPECIE_HUMANOID)).toBe(1);
    });
});

describe('getArmorClass - mixed properties', () => {
    let creature: Creature;

    beforeEach(() => {
        creature = new Creature('test');
    });

    it('base is unaffected by attack-type and damage-type properties', () => {
        addAC(creature, 5, { attackType: CONSTS.ATTACK_TYPE_MELEE });
        addAC(creature, 3, { damageType: CONSTS.DAMAGE_TYPE_THERMAL });
        addAC(creature, 2, { specie: CONSTS.SPECIE_BEAST });
        expect(creature.getters.getArmorClass.base).toBe(VARS.ARMOR_CLASS_BASE_VALUE);
    });

    it('all three registries are populated independently from a mixed property set', () => {
        addAC(creature, 4, { attackType: CONSTS.ATTACK_TYPE_MELEE });
        addAC(creature, 3, { damageType: CONSTS.DAMAGE_TYPE_ELECTRIC });
        addAC(creature, 2, { specie: CONSTS.SPECIE_FIEND });
        const ac = creature.getters.getArmorClass;
        expect(ac.attackTypes.get(CONSTS.ATTACK_TYPE_MELEE)).toBe(4);
        expect(ac.damageTypes.get(CONSTS.DAMAGE_TYPE_ELECTRIC)).toBe(3);
        expect(ac.species.get(CONSTS.SPECIE_FIEND)).toBe(2);
    });
});
