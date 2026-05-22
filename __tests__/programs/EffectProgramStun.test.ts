import { beforeEach, describe, expect, it } from 'vitest';
import { Creature } from '../../src/Creature';
import { CONSTS } from '../../src/consts';

// Default MIND = 10, modifier = 0, so d20+0 vs dc:
// dc = 1  → always succeeds
// dc = 21 → always fails

describe('EffectProgramStun', () => {
    let attacker: Creature;
    let target: Creature;

    beforeEach(() => {
        attacker = new Creature('attacker');
        target = new Creature('target');
        target.hitPoints = 20;
    });

    function applyStun(dc: number, duration = 10) {
        target.state.effects.push({
            id: 'stun-1',
            type: CONSTS.EFFECT_STUN,
            subtype: CONSTS.EFFECT_SUBTYPE_MAGICAL,
            duration,
            target: target.id,
            source: attacker.id,
            siblings: [],
            tag: '',
            data: { type: CONSTS.EFFECT_STUN, dc },
        });
    }

    it('removes stun when mind resistance check succeeds on damage (dc = 1)', () => {
        applyStun(1);
        expect(target.state.effects.some((e) => e.type === CONSTS.EFFECT_STUN)).toBe(true);

        target.applyEffect(
            { type: CONSTS.EFFECT_DAMAGE, damageType: CONSTS.DAMAGE_TYPE_SLASHING, amp: 3 },
            attacker, 0
        );

        expect(target.state.effects.some((e) => e.type === CONSTS.EFFECT_STUN)).toBe(false);
    });

    it('keeps stun when mind resistance check fails on damage (dc = 21)', () => {
        applyStun(21);

        target.applyEffect(
            { type: CONSTS.EFFECT_DAMAGE, damageType: CONSTS.DAMAGE_TYPE_SLASHING, amp: 3 },
            attacker, 0
        );

        expect(target.state.effects.some((e) => e.type === CONSTS.EFFECT_STUN)).toBe(true);
    });

    it('does not check resistance when dc is 0', () => {
        applyStun(0);

        target.applyEffect(
            { type: CONSTS.EFFECT_DAMAGE, damageType: CONSTS.DAMAGE_TYPE_SLASHING, amp: 3 },
            attacker, 0
        );

        expect(target.state.effects.some((e) => e.type === CONSTS.EFFECT_STUN)).toBe(true);
    });
});
