import { beforeEach, describe, expect, it } from 'vitest';
import { Creature } from '../../src/Creature';
import { CONSTS } from '../../src/consts';
import { EffectDefinition } from '../../src/effects/schemas';

const DURATION = 100;

// Minimal valid definition for each status effect type
const EFFECT_DEFINITIONS: Record<string, EffectDefinition> = {
    [CONSTS.EFFECT_CHARM]:        { type: CONSTS.EFFECT_CHARM },
    [CONSTS.EFFECT_DISEASE]:      { type: CONSTS.EFFECT_DISEASE, disease: CONSTS.DISEASE_RAT_SICKNESS },
    [CONSTS.EFFECT_FEAR]:         { type: CONSTS.EFFECT_FEAR },
    [CONSTS.EFFECT_PARALYSIS]:    { type: CONSTS.EFFECT_PARALYSIS },
    [CONSTS.EFFECT_PETRIFICATION]:{ type: CONSTS.EFFECT_PETRIFICATION },
    [CONSTS.EFFECT_POISON]:       { type: CONSTS.EFFECT_POISON, amp: '1d6' },
    [CONSTS.EFFECT_ROOT]:         { type: CONSTS.EFFECT_ROOT },
    [CONSTS.EFFECT_STUN]:         { type: CONSTS.EFFECT_STUN },
    [CONSTS.EFFECT_BLINDNESS]:    { type: CONSTS.EFFECT_BLINDNESS },
};

const STATUS_EFFECTS: Array<{ effectType: string; immunityType: string }> = [
    { effectType: CONSTS.EFFECT_CHARM,         immunityType: CONSTS.IMMUNITY_TYPE_CHARM         },
    { effectType: CONSTS.EFFECT_DISEASE,       immunityType: CONSTS.IMMUNITY_TYPE_DISEASE       },
    { effectType: CONSTS.EFFECT_FEAR,          immunityType: CONSTS.IMMUNITY_TYPE_FEAR          },
    { effectType: CONSTS.EFFECT_PARALYSIS,     immunityType: CONSTS.IMMUNITY_TYPE_PARALYSIS     },
    { effectType: CONSTS.EFFECT_PETRIFICATION, immunityType: CONSTS.IMMUNITY_TYPE_PETRIFICATION },
    { effectType: CONSTS.EFFECT_POISON,        immunityType: CONSTS.IMMUNITY_TYPE_POISON        },
    { effectType: CONSTS.EFFECT_ROOT,          immunityType: CONSTS.IMMUNITY_TYPE_ROOT          },
    { effectType: CONSTS.EFFECT_STUN,          immunityType: CONSTS.IMMUNITY_TYPE_STUN          },
    { effectType: CONSTS.EFFECT_BLINDNESS,     immunityType: CONSTS.IMMUNITY_TYPE_BLINDNESS     },
];

describe('getImmunities', () => {
    let creature: Creature;
    let source: Creature;

    beforeEach(() => {
        creature = new Creature('target');
        source = new Creature('source');
    });

    it('all immunities are false on a fresh creature', () => {
        const immunities = creature.getters.getImmunities;
        for (const { immunityType } of STATUS_EFFECTS) {
            expect(immunities[immunityType as keyof typeof immunities], immunityType).toBe(false);
        }
        expect(immunities[CONSTS.IMMUNITY_TYPE_CRITICAL_HIT]).toBe(false);
    });

    describe('granting immunity via PROPERTY_IMMUNITY', () => {
        for (const { immunityType } of STATUS_EFFECTS) {
            it(`getImmunities reports true for ${immunityType}`, () => {
                creature.addInnateProperty({ type: CONSTS.PROPERTY_IMMUNITY, immunityType } as never);
                expect(creature.getters.getImmunities[immunityType as keyof typeof creature.getters.getImmunities]).toBe(true);
            });
        }

        it('grants IMMUNITY_TYPE_CRITICAL_HIT', () => {
            creature.addInnateProperty({
                type: CONSTS.PROPERTY_IMMUNITY,
                immunityType: CONSTS.IMMUNITY_TYPE_CRITICAL_HIT,
            } as never);
            expect(creature.getters.getImmunities[CONSTS.IMMUNITY_TYPE_CRITICAL_HIT]).toBe(true);
        });
    });

    describe('granting immunity via EFFECT_IMMUNITY', () => {
        for (const { immunityType } of STATUS_EFFECTS) {
            it(`getImmunities reports true for ${immunityType}`, () => {
                creature.applyEffect(
                    { type: CONSTS.EFFECT_IMMUNITY, immunityType } as never,
                    source,
                    DURATION
                );
                expect(creature.getters.getImmunities[immunityType as keyof typeof creature.getters.getImmunities]).toBe(true);
            });
        }
    });

    describe('effect rejection', () => {
        for (const { effectType, immunityType } of STATUS_EFFECTS) {
            describe(effectType, () => {
                it('is applied when creature has no immunity', () => {
                    creature.applyEffect(EFFECT_DEFINITIONS[effectType], source, DURATION);
                    expect(creature.state.effects.some((e) => e.type === effectType)).toBe(true);
                });

                it('is rejected when creature has PROPERTY_IMMUNITY', () => {
                    creature.addInnateProperty({ type: CONSTS.PROPERTY_IMMUNITY, immunityType } as never);
                    creature.applyEffect(EFFECT_DEFINITIONS[effectType], source, DURATION);
                    expect(creature.state.effects.some((e) => e.type === effectType)).toBe(false);
                });

                it('is rejected when creature has EFFECT_IMMUNITY', () => {
                    creature.applyEffect(
                        { type: CONSTS.EFFECT_IMMUNITY, immunityType } as never,
                        source,
                        DURATION
                    );
                    creature.applyEffect(EFFECT_DEFINITIONS[effectType], source, DURATION);
                    expect(creature.state.effects.some((e) => e.type === effectType)).toBe(false);
                });
            });
        }
    });

    describe('immunity does not bleed over to other effect types', () => {
        it('IMMUNITY_TYPE_CHARM does not block EFFECT_FEAR', () => {
            creature.addInnateProperty({
                type: CONSTS.PROPERTY_IMMUNITY,
                immunityType: CONSTS.IMMUNITY_TYPE_CHARM,
            } as never);
            creature.applyEffect(EFFECT_DEFINITIONS[CONSTS.EFFECT_FEAR], source, DURATION);
            expect(creature.state.effects.some((e) => e.type === CONSTS.EFFECT_FEAR)).toBe(true);
        });

        it('IMMUNITY_TYPE_POISON does not block EFFECT_DISEASE', () => {
            creature.addInnateProperty({
                type: CONSTS.PROPERTY_IMMUNITY,
                immunityType: CONSTS.IMMUNITY_TYPE_POISON,
            } as never);
            creature.applyEffect(EFFECT_DEFINITIONS[CONSTS.EFFECT_DISEASE], source, DURATION);
            expect(creature.state.effects.some((e) => e.type === CONSTS.EFFECT_DISEASE)).toBe(true);
        });
    });
});
