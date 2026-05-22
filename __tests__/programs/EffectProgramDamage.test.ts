import { beforeEach, describe, expect, it } from 'vitest';
import { Creature } from '../../src/Creature';
import { CONSTS } from '../../src/consts';

function makeDamageEffect(amp: number) {
    return {
        type: CONSTS.EFFECT_DAMAGE,
        damageType: CONSTS.DAMAGE_TYPE_THERMAL,
        amp,
    } as const;
}

describe('EffectProgramDamage', () => {
    let attacker: Creature;
    let target: Creature;

    beforeEach(() => {
        attacker = new Creature('attacker');
        target = new Creature('target');
        target.hitPoints = 20; // max HP for default Creature (no body bonus)
    });

    describe('apply — instant damage', () => {
        it('reduces hitPoints by amp on application', () => {
            target.applyEffect(makeDamageEffect(10), attacker, 0);
            expect(target.hitPoints).toBe(10);
        });

        it('applies damage reduction before dealing damage', () => {
            target.state.effects.push({
                id: 'dr-1',
                type: CONSTS.EFFECT_DAMAGE_REDUCTION,
                subtype: CONSTS.EFFECT_SUBTYPE_MAGICAL,
                duration: 10,
                target: target.id,
                source: attacker.id,
                siblings: [],
                tag: '',
                data: { type: CONSTS.EFFECT_DAMAGE_REDUCTION, damageType: CONSTS.DAMAGE_TYPE_THERMAL, amp: 4 },
            });
            target.applyEffect(makeDamageEffect(10), attacker, 0);
            expect(target.hitPoints).toBe(14); // 20 - (10 - 4)
        });

        it('does not reduce hitPoints below 0', () => {
            target.applyEffect(makeDamageEffect(9999), attacker, 0);
            expect(target.hitPoints).toBe(0);
        });

        it('deals no damage when amp is fully reduced', () => {
            target.state.effects.push({
                id: 'dr-1',
                type: CONSTS.EFFECT_DAMAGE_REDUCTION,
                subtype: CONSTS.EFFECT_SUBTYPE_MAGICAL,
                duration: 10,
                target: target.id,
                source: attacker.id,
                siblings: [],
                tag: '',
                data: { type: CONSTS.EFFECT_DAMAGE_REDUCTION, damageType: CONSTS.DAMAGE_TYPE_THERMAL, amp: 10 },
            });
            target.applyEffect(makeDamageEffect(5), attacker, 0);
            expect(target.hitPoints).toBe(20);
        });
    });

    describe('mutate — damage over time', () => {
        it('deals damage each time process() is called while effect persists', () => {
            target.applyEffect(makeDamageEffect(3), attacker, 3);
            expect(target.hitPoints).toBe(17); // apply fires first hit

            target.process(); // mutate fires: -3
            expect(target.hitPoints).toBe(14);

            target.process(); // mutate fires: -3
            expect(target.hitPoints).toBe(11);
        });

        it('stops dealing damage once the effect is removed', () => {
            target.applyEffect(makeDamageEffect(5), attacker, 1);
            expect(target.hitPoints).toBe(15); // apply fires first hit

            target.process(); // mutate: -5
            expect(target.hitPoints).toBe(10);

            target.depleteEffects(); // duration reaches 0 → effect removed
            target.process(); // no more effect → no more damage
            expect(target.hitPoints).toBe(10);
        });
    });
});
