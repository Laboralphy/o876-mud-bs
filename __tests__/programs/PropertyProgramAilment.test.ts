import { beforeEach, describe, expect, it } from 'vitest';
import { Creature } from '../../src/Creature';
import { CONSTS } from '../../src/consts';

function makeAttacker(): Creature {
    return new Creature('attacker');
}

function makeTarget(): Creature {
    return new Creature('target');
}

function trigger(attacker: Creature, target: Creature): void {
    attacker.triggerDamageEvent(5, CONSTS.DAMAGE_TYPE_SLASHING, target);
}

function hasEffect(target: Creature, effectType: string): boolean {
    return target.state.effects.some((e) => e.type === effectType);
}

// Base property shared by every test — chance=20 (always triggers), dc=21 (target never resists)
const BASE = {
    chance: 20,
    duration: 10,
    subtype: CONSTS.EFFECT_SUBTYPE_SUPERNATURAL,
    dc: 21,
};

describe('PropertyProgramAilment – chance check', () => {
    it('applies ailment when chance=20 (1d20 never exceeds 20)', () => {
        const attacker = makeAttacker();
        const target = makeTarget();
        attacker.addInnateProperty({
            type: CONSTS.PROPERTY_AILMENT,
            ...BASE,
            ailment: CONSTS.AILMENT_BLINDNESS,
        });
        trigger(attacker, target);
        expect(hasEffect(target, CONSTS.EFFECT_BLINDNESS)).toBe(true);
    });
});

describe('PropertyProgramAilment – AILMENT_ABILITY_DRAIN', () => {
    let attacker: Creature;
    let target: Creature;

    beforeEach(() => {
        attacker = makeAttacker();
        target = makeTarget();
        attacker.addInnateProperty({
            type: CONSTS.PROPERTY_AILMENT,
            ...BASE,
            ailment: CONSTS.AILMENT_ABILITY_DRAIN,
            amp: 1,
            ability: CONSTS.ABILITY_BODY,
        });
    });

    it('applies EFFECT_ABILITY_MODIFIER to target', () => {
        trigger(attacker, target);
        expect(hasEffect(target, CONSTS.EFFECT_ABILITY_MODIFIER)).toBe(true);
    });

    it('applied modifier is negative (drain)', () => {
        trigger(attacker, target);
        const e = target.state.effects.find((e) => e.type === CONSTS.EFFECT_ABILITY_MODIFIER);
        expect((e!.data as { amp: number }).amp).toBeLessThan(0);
    });

    it('is blocked when target ability-resists (dc=0)', () => {
        attacker = makeAttacker();
        target = makeTarget();
        attacker.addInnateProperty({
            type: CONSTS.PROPERTY_AILMENT,
            ...BASE,
            dc: 0,
            ailment: CONSTS.AILMENT_ABILITY_DRAIN,
            amp: 1,
            ability: CONSTS.ABILITY_BODY,
        });
        trigger(attacker, target);
        expect(hasEffect(target, CONSTS.EFFECT_ABILITY_MODIFIER)).toBe(false);
    });

    it('bypasses ability resistance when subtype is UNYIELDING', () => {
        attacker = makeAttacker();
        target = makeTarget();
        attacker.addInnateProperty({
            type: CONSTS.PROPERTY_AILMENT,
            ...BASE,
            dc: 0, // would always be resisted for supernatural/weapon/etc.
            subtype: CONSTS.EFFECT_SUBTYPE_UNYIELDING,
            ailment: CONSTS.AILMENT_ABILITY_DRAIN,
            amp: 1,
            ability: CONSTS.ABILITY_BODY,
        });
        trigger(attacker, target);
        expect(hasEffect(target, CONSTS.EFFECT_ABILITY_MODIFIER)).toBe(true);
    });
});

describe('PropertyProgramAilment – AILMENT_ATTACK_DRAIN', () => {
    let attacker: Creature;
    let target: Creature;

    beforeEach(() => {
        attacker = makeAttacker();
        target = makeTarget();
    });

    it('applies EFFECT_ATTACK_MODIFIER to target', () => {
        attacker.addInnateProperty({
            type: CONSTS.PROPERTY_AILMENT,
            ...BASE,
            ailment: CONSTS.AILMENT_ATTACK_DRAIN,
            amp: 1,
        });
        trigger(attacker, target);
        expect(hasEffect(target, CONSTS.EFFECT_ATTACK_MODIFIER)).toBe(true);
    });

    it('applied modifier is negative (drain)', () => {
        attacker.addInnateProperty({
            type: CONSTS.PROPERTY_AILMENT,
            ...BASE,
            ailment: CONSTS.AILMENT_ATTACK_DRAIN,
            amp: 1,
        });
        trigger(attacker, target);
        const e = target.state.effects.find((e) => e.type === CONSTS.EFFECT_ATTACK_MODIFIER);
        expect((e!.data as { amp: number }).amp).toBeLessThan(0);
    });

    it('is blocked when target ability-resists (dc=0)', () => {
        attacker.addInnateProperty({
            type: CONSTS.PROPERTY_AILMENT,
            ...BASE,
            dc: 0,
            ailment: CONSTS.AILMENT_ATTACK_DRAIN,
            amp: 1,
        });
        trigger(attacker, target);
        expect(hasEffect(target, CONSTS.EFFECT_ATTACK_MODIFIER)).toBe(false);
    });
});

describe('PropertyProgramAilment – AILMENT_ARMOR_CLASS_DRAIN', () => {
    let attacker: Creature;
    let target: Creature;

    beforeEach(() => {
        attacker = makeAttacker();
        target = makeTarget();
    });

    it('applies EFFECT_ARMOR_CLASS_MODIFIER to target', () => {
        attacker.addInnateProperty({
            type: CONSTS.PROPERTY_AILMENT,
            ...BASE,
            ailment: CONSTS.AILMENT_ARMOR_CLASS_DRAIN,
            amp: 1,
        });
        trigger(attacker, target);
        expect(hasEffect(target, CONSTS.EFFECT_ARMOR_CLASS_MODIFIER)).toBe(true);
    });

    it('applied modifier is negative (drain)', () => {
        attacker.addInnateProperty({
            type: CONSTS.PROPERTY_AILMENT,
            ...BASE,
            ailment: CONSTS.AILMENT_ARMOR_CLASS_DRAIN,
            amp: 1,
        });
        trigger(attacker, target);
        const e = target.state.effects.find((e) => e.type === CONSTS.EFFECT_ARMOR_CLASS_MODIFIER);
        expect((e!.data as { amp: number }).amp).toBeLessThan(0);
    });

    it('is blocked when target ability-resists (dc=0)', () => {
        attacker.addInnateProperty({
            type: CONSTS.PROPERTY_AILMENT,
            ...BASE,
            dc: 0,
            ailment: CONSTS.AILMENT_ARMOR_CLASS_DRAIN,
            amp: 1,
        });
        trigger(attacker, target);
        expect(hasEffect(target, CONSTS.EFFECT_ARMOR_CLASS_MODIFIER)).toBe(false);
    });
});

describe('PropertyProgramAilment – AILMENT_DISEASE', () => {
    let attacker: Creature;
    let target: Creature;

    beforeEach(() => {
        attacker = makeAttacker();
        target = makeTarget();
        attacker.addInnateProperty({
            type: CONSTS.PROPERTY_AILMENT,
            ...BASE,
            ailment: CONSTS.AILMENT_DISEASE,
            disease: CONSTS.DISEASE_RAT_SICKNESS,
        });
    });

    it('applies EFFECT_DISEASE to target', () => {
        trigger(attacker, target);
        expect(hasEffect(target, CONSTS.EFFECT_DISEASE)).toBe(true);
    });

    it('disease effect carries the correct disease identifier', () => {
        trigger(attacker, target);
        const e = target.state.effects.find((e) => e.type === CONSTS.EFFECT_DISEASE);
        expect((e!.data as { disease: string }).disease).toBe(CONSTS.DISEASE_RAT_SICKNESS);
    });

    it('does not stack the same disease (deduplication)', () => {
        trigger(attacker, target);
        trigger(attacker, target);
        const count = target.state.effects.filter((e) => e.type === CONSTS.EFFECT_DISEASE).length;
        expect(count).toBe(1);
    });

    it('allows two different diseases simultaneously', () => {
        const attacker2 = makeAttacker();
        attacker2.addInnateProperty({
            type: CONSTS.PROPERTY_AILMENT,
            ...BASE,
            ailment: CONSTS.AILMENT_DISEASE,
            disease: CONSTS.DISEASE_GHOUL_FEVER,
        });
        trigger(attacker, target);
        trigger(attacker2, target);
        const count = target.state.effects.filter((e) => e.type === CONSTS.EFFECT_DISEASE).length;
        expect(count).toBe(2);
    });

    it('is blocked when target skill-resists (dc=0)', () => {
        attacker = makeAttacker();
        target = makeTarget();
        attacker.addInnateProperty({
            type: CONSTS.PROPERTY_AILMENT,
            ...BASE,
            dc: 0,
            ailment: CONSTS.AILMENT_DISEASE,
            disease: CONSTS.DISEASE_RAT_SICKNESS,
        });
        trigger(attacker, target);
        expect(hasEffect(target, CONSTS.EFFECT_DISEASE)).toBe(false);
    });
});

describe('PropertyProgramAilment – AILMENT_BLINDNESS', () => {
    let attacker: Creature;
    let target: Creature;

    beforeEach(() => {
        attacker = makeAttacker();
        target = makeTarget();
        attacker.addInnateProperty({
            type: CONSTS.PROPERTY_AILMENT,
            ...BASE,
            ailment: CONSTS.AILMENT_BLINDNESS,
        });
    });

    it('applies EFFECT_BLINDNESS to target', () => {
        trigger(attacker, target);
        expect(hasEffect(target, CONSTS.EFFECT_BLINDNESS)).toBe(true);
    });

    it('is blocked when target skill-resists (dc=0)', () => {
        attacker = makeAttacker();
        target = makeTarget();
        attacker.addInnateProperty({
            type: CONSTS.PROPERTY_AILMENT,
            ...BASE,
            dc: 0,
            ailment: CONSTS.AILMENT_BLINDNESS,
        });
        trigger(attacker, target);
        expect(hasEffect(target, CONSTS.EFFECT_BLINDNESS)).toBe(false);
    });
});

describe('PropertyProgramAilment – AILMENT_FEAR', () => {
    let attacker: Creature;
    let target: Creature;

    beforeEach(() => {
        attacker = makeAttacker();
        target = makeTarget();
        attacker.addInnateProperty({
            type: CONSTS.PROPERTY_AILMENT,
            ...BASE,
            ailment: CONSTS.AILMENT_FEAR,
        });
    });

    it('applies EFFECT_FEAR to target', () => {
        trigger(attacker, target);
        expect(hasEffect(target, CONSTS.EFFECT_FEAR)).toBe(true);
    });

    it('fear effect carries the dc', () => {
        trigger(attacker, target);
        const e = target.state.effects.find((e) => e.type === CONSTS.EFFECT_FEAR);
        expect((e!.data as { dc: number }).dc).toBe(BASE.dc);
    });

    it('is blocked when target skill-resists (dc=0)', () => {
        attacker = makeAttacker();
        target = makeTarget();
        attacker.addInnateProperty({
            type: CONSTS.PROPERTY_AILMENT,
            ...BASE,
            dc: 0,
            ailment: CONSTS.AILMENT_FEAR,
        });
        trigger(attacker, target);
        expect(hasEffect(target, CONSTS.EFFECT_FEAR)).toBe(false);
    });
});

describe('PropertyProgramAilment – AILMENT_POISON', () => {
    let attacker: Creature;
    let target: Creature;

    beforeEach(() => {
        attacker = makeAttacker();
        target = makeTarget();
        attacker.addInnateProperty({
            type: CONSTS.PROPERTY_AILMENT,
            ...BASE,
            ailment: CONSTS.AILMENT_POISON,
            amp: '1d4',
        });
    });

    it('applies EFFECT_POISON to target', () => {
        trigger(attacker, target);
        expect(hasEffect(target, CONSTS.EFFECT_POISON)).toBe(true);
    });

    it('poison amp is stored as a string on the effect', () => {
        trigger(attacker, target);
        const e = target.state.effects.find((e) => e.type === CONSTS.EFFECT_POISON);
        expect(typeof (e!.data as { amp: unknown }).amp).toBe('string');
    });

    it('uses DAMAGE_TYPE_NECROTIC as default damage type', () => {
        trigger(attacker, target);
        const e = target.state.effects.find((e) => e.type === CONSTS.EFFECT_POISON);
        expect((e!.data as { damageType: string }).damageType).toBe(CONSTS.DAMAGE_TYPE_NECROTIC);
    });


    it('is blocked when target skill-resists (dc=0)', () => {
        attacker = makeAttacker();
        target = makeTarget();
        attacker.addInnateProperty({
            type: CONSTS.PROPERTY_AILMENT,
            ...BASE,
            dc: 0,
            ailment: CONSTS.AILMENT_POISON,
            amp: '1d4',
        });
        trigger(attacker, target);
        expect(hasEffect(target, CONSTS.EFFECT_POISON)).toBe(false);
    });
});

describe('PropertyProgramAilment – AILMENT_PARALYSIS', () => {
    let attacker: Creature;
    let target: Creature;

    beforeEach(() => {
        attacker = makeAttacker();
        target = makeTarget();
        attacker.addInnateProperty({
            type: CONSTS.PROPERTY_AILMENT,
            ...BASE,
            ailment: CONSTS.AILMENT_PARALYSIS,
        });
    });

    it('applies EFFECT_PARALYSIS to target', () => {
        trigger(attacker, target);
        expect(hasEffect(target, CONSTS.EFFECT_PARALYSIS)).toBe(true);
    });

    it('is blocked when target skill-resists (dc=0)', () => {
        attacker = makeAttacker();
        target = makeTarget();
        attacker.addInnateProperty({
            type: CONSTS.PROPERTY_AILMENT,
            ...BASE,
            dc: 0,
            ailment: CONSTS.AILMENT_PARALYSIS,
        });
        trigger(attacker, target);
        expect(hasEffect(target, CONSTS.EFFECT_PARALYSIS)).toBe(false);
    });
});

describe('PropertyProgramAilment – AILMENT_PETRIFICATION', () => {
    let attacker: Creature;
    let target: Creature;

    beforeEach(() => {
        attacker = makeAttacker();
        target = makeTarget();
        attacker.addInnateProperty({
            type: CONSTS.PROPERTY_AILMENT,
            ...BASE,
            ailment: CONSTS.AILMENT_PETRIFICATION,
        });
    });

    it('applies EFFECT_PETRIFICATION to target', () => {
        trigger(attacker, target);
        expect(hasEffect(target, CONSTS.EFFECT_PETRIFICATION)).toBe(true);
    });

    it('petrification effect has amp=1', () => {
        trigger(attacker, target);
        const e = target.state.effects.find((e) => e.type === CONSTS.EFFECT_PETRIFICATION);
        expect((e!.data as { amp: number }).amp).toBe(1);
    });

    it('is blocked when target ability-resists (dc=0)', () => {
        attacker = makeAttacker();
        target = makeTarget();
        attacker.addInnateProperty({
            type: CONSTS.PROPERTY_AILMENT,
            ...BASE,
            dc: 0,
            ailment: CONSTS.AILMENT_PETRIFICATION,
        });
        trigger(attacker, target);
        expect(hasEffect(target, CONSTS.EFFECT_PETRIFICATION)).toBe(false);
    });

    it('bypasses ability resistance when subtype is UNYIELDING', () => {
        attacker = makeAttacker();
        target = makeTarget();
        attacker.addInnateProperty({
            type: CONSTS.PROPERTY_AILMENT,
            ...BASE,
            dc: 0,
            subtype: CONSTS.EFFECT_SUBTYPE_UNYIELDING,
            ailment: CONSTS.AILMENT_PETRIFICATION,
        });
        trigger(attacker, target);
        expect(hasEffect(target, CONSTS.EFFECT_PETRIFICATION)).toBe(true);
    });
});

describe('PropertyProgramAilment – AILMENT_STUN', () => {
    let attacker: Creature;
    let target: Creature;

    beforeEach(() => {
        attacker = makeAttacker();
        target = makeTarget();
        attacker.addInnateProperty({
            type: CONSTS.PROPERTY_AILMENT,
            ...BASE,
            ailment: CONSTS.AILMENT_STUN,
        });
    });

    it('applies EFFECT_STUN to target', () => {
        trigger(attacker, target);
        expect(hasEffect(target, CONSTS.EFFECT_STUN)).toBe(true);
    });

    it('is blocked when target skill-resists (dc=0)', () => {
        attacker = makeAttacker();
        target = makeTarget();
        attacker.addInnateProperty({
            type: CONSTS.PROPERTY_AILMENT,
            ...BASE,
            dc: 0,
            ailment: CONSTS.AILMENT_STUN,
        });
        trigger(attacker, target);
        expect(hasEffect(target, CONSTS.EFFECT_STUN)).toBe(false);
    });
});

describe('PropertyProgramAilment – AILMENT_ROOT', () => {
    let attacker: Creature;
    let target: Creature;

    beforeEach(() => {
        attacker = makeAttacker();
        target = makeTarget();
        attacker.addInnateProperty({
            type: CONSTS.PROPERTY_AILMENT,
            ...BASE,
            ailment: CONSTS.AILMENT_ROOT,
        });
    });

    it('applies EFFECT_ROOT to target', () => {
        trigger(attacker, target);
        expect(hasEffect(target, CONSTS.EFFECT_ROOT)).toBe(true);
    });

    it('is blocked when target skill-resists (dc=0)', () => {
        attacker = makeAttacker();
        target = makeTarget();
        attacker.addInnateProperty({
            type: CONSTS.PROPERTY_AILMENT,
            ...BASE,
            dc: 0,
            ailment: CONSTS.AILMENT_ROOT,
        });
        trigger(attacker, target);
        expect(hasEffect(target, CONSTS.EFFECT_ROOT)).toBe(false);
    });
});
