import { beforeEach, describe, expect, it } from 'vitest';
import { Creature } from '../../src/Creature';
import { CONSTS } from '../../src/consts';

function makeHealEffect(amp: number) {
    return {
        type: CONSTS.EFFECT_HEAL,
        amp,
    } as const;
}

describe('EffectProgramHeal', () => {
    let attacker: Creature;
    let target: Creature;

    beforeEach(() => {
        attacker = new Creature('attacker');
        target = new Creature('target');
        target.hitPoints = 5; // start injured (max HP = 20)
    });

    describe('apply — instant heal', () => {
        it('increases hitPoints by amp on application', () => {
            target.applyEffect(makeHealEffect(10), attacker, 0);
            expect(target.hitPoints).toBe(15);
        });

        it('does not exceed max hitPoints', () => {
            target.applyEffect(makeHealEffect(9999), attacker, 0);
            expect(target.hitPoints).toBe(20);
        });

        it('applies healing modifier before healing', () => {
            target.state.effects.push({
                id: 'hm-1',
                type: CONSTS.EFFECT_HEALING_MODIFIER,
                subtype: CONSTS.EFFECT_SUBTYPE_MAGICAL,
                duration: 10,
                target: target.id,
                source: attacker.id,
                siblings: [],
                tag: '',
                data: { type: CONSTS.EFFECT_HEALING_MODIFIER, amp: 3 },
            });
            target.applyEffect(makeHealEffect(7), attacker, 0);
            expect(target.hitPoints).toBe(15); // 5 + (7 + 3) * 1
        });

        it('applies healing factor before healing', () => {
            target.state.effects.push({
                id: 'hf-1',
                type: CONSTS.EFFECT_HEALING_FACTOR,
                subtype: CONSTS.EFFECT_SUBTYPE_MAGICAL,
                duration: 10,
                target: target.id,
                source: attacker.id,
                siblings: [],
                tag: '',
                data: { type: CONSTS.EFFECT_HEALING_FACTOR, amp: 2 },
            });
            target.applyEffect(makeHealEffect(5), attacker, 0);
            expect(target.hitPoints).toBe(15); // 5 + floor((5 + 0) * 2) = 5 + 10 = 15
        });

        it('halves healing when factor is 0.5', () => {
            target.state.effects.push({
                id: 'hf-1',
                type: CONSTS.EFFECT_HEALING_FACTOR,
                subtype: CONSTS.EFFECT_SUBTYPE_MAGICAL,
                duration: 10,
                target: target.id,
                source: attacker.id,
                siblings: [],
                tag: '',
                data: { type: CONSTS.EFFECT_HEALING_FACTOR, amp: 0.5 },
            });
            target.applyEffect(makeHealEffect(10), attacker, 0);
            expect(target.hitPoints).toBe(10); // 5 + floor(10 * 0.5) = 5 + 5 = 10
        });
    });

    describe('mutate — heal over time', () => {
        it('heals each time process() is called while effect persists', () => {
            target.applyEffect(makeHealEffect(3), attacker, 3);
            expect(target.hitPoints).toBe(8); // apply fires first tick

            target.process(); // mutate: +3
            expect(target.hitPoints).toBe(11);

            target.process(); // mutate: +3
            expect(target.hitPoints).toBe(14);
        });

        it('stops healing once the effect is removed', () => {
            target.applyEffect(makeHealEffect(4), attacker, 1);
            expect(target.hitPoints).toBe(9); // apply fires first tick

            target.process(); // mutate: +4
            expect(target.hitPoints).toBe(13);

            target.depleteEffects(); // duration reaches 0 → effect removed
            target.process(); // no more effect → no more healing
            expect(target.hitPoints).toBe(13);
        });
    });
});
