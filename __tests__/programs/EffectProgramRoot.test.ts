import { beforeEach, describe, expect, it } from 'vitest';
import { Creature } from '../../src/Creature';
import { CONSTS } from '../../src/consts';

describe('EffectProgramRoot', () => {
    let attacker: Creature;
    let target: Creature;

    beforeEach(() => {
        attacker = new Creature('attacker');
        target = new Creature('target');
        target.hitPoints = 20;
    });

    function applyRoot(dc: number, duration = 10) {
        target.state.effects.push({
            id: 'root-1',
            type: CONSTS.EFFECT_ROOT,
            subtype: CONSTS.EFFECT_SUBTYPE_MAGICAL,
            duration,
            target: target.id,
            source: attacker.id,
            siblings: [],
            tag: '',
            data: { type: CONSTS.EFFECT_ROOT, dc },
        });
    }

    it('removes root when acrobatics check succeeds on damage (dc = 1)', () => {
        applyRoot(1);
        expect(target.state.effects.some((e) => e.type === CONSTS.EFFECT_ROOT)).toBe(true);

        target.applyEffect(
            { type: CONSTS.EFFECT_DAMAGE, damageType: CONSTS.DAMAGE_TYPE_SLASHING, amp: 3 },
            attacker, 0
        );

        expect(target.state.effects.some((e) => e.type === CONSTS.EFFECT_ROOT)).toBe(false);
    });

    it('keeps root when acrobatics check fails on damage (dc = 21)', () => {
        applyRoot(21);

        target.applyEffect(
            { type: CONSTS.EFFECT_DAMAGE, damageType: CONSTS.DAMAGE_TYPE_SLASHING, amp: 3 },
            attacker, 0
        );

        expect(target.state.effects.some((e) => e.type === CONSTS.EFFECT_ROOT)).toBe(true);
    });

    it('does not check resistance when dc is 0', () => {
        applyRoot(0);

        target.applyEffect(
            { type: CONSTS.EFFECT_DAMAGE, damageType: CONSTS.DAMAGE_TYPE_SLASHING, amp: 3 },
            attacker, 0
        );

        expect(target.state.effects.some((e) => e.type === CONSTS.EFFECT_ROOT)).toBe(true);
    });
});
