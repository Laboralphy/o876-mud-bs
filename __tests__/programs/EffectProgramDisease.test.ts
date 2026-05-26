import { beforeEach, afterEach, describe, expect, it } from 'vitest';
import { Creature } from '../../src/Creature';
import { CONSTS } from '../../src/consts';
import { EffectDisease } from '../../src/effects/schemas/status/disease';

const LONG_DURATION = Number.MAX_SAFE_INTEGER;

// Default creature has no skill modifiers, so SKILL_SURVIVAL roll = 1d20 + 0.
// dc=1  → 1d20 always >= 1 → survival check always succeeds → disease cured.
// dc=21 → 1d20 max 20 < 21 → survival check always fails   → stage advances.
//
// target.dice.cheat(0): forces random() to 0, so any dice.roll formula returns
// Math.trunc(0 * sides) + 1 = 1.  This gives deterministic stage duration and
// damage rolls without touching the dice prototype.
// The DiceRoll objects used internally by checkSkill use their own Dice instance
// and are not affected by target.dice.cheat(), so dc=1/dc=21 remain the only
// way to control survival outcomes.

describe('EffectProgramDisease', () => {
    let attacker: Creature;
    let target: Creature;

    beforeEach(() => {
        attacker = new Creature('attacker');
        target = new Creature('target');
        target.hitPoints = target.getters.getMaxHitPoints;
        target.dice.cheat(0); // all dice.roll() on target return 1
    });

    afterEach(() => {
        target.dice.cheatOff();
    });

    // ─── helpers ──────────────────────────────────────────────────────────────

    /** Apply RAT_SICKNESS via the normal effect path (triggers apply hook). */
    function applyRatSickness(dc: number) {
        return target.applyEffect(
            EffectDisease.parse({
                type: CONSTS.EFFECT_DISEASE,
                disease: CONSTS.DISEASE_RAT_SICKNESS,
                dc,
            }),
            attacker,
            Number.MAX_SAFE_INTEGER
        );
    }

    /**
     * Push a RAT_SICKNESS effect directly into state.effects at a specific stage,
     * bypassing the apply hook.  Used to test mutate behaviour in isolation.
     */
    function pushRatSicknessAtStage(stage: number, amp: number, dc: number) {
        const eff = {
            id: `disease-stage-${stage}`,
            type: CONSTS.EFFECT_DISEASE,
            subtype: CONSTS.EFFECT_SUBTYPE_MAGICAL,
            duration: LONG_DURATION,
            target: target.id,
            source: attacker.id,
            siblings: [],
            tag: '',
            data: {
                type: CONSTS.EFFECT_DISEASE,
                amp,
                disease: CONSTS.DISEASE_RAT_SICKNESS,
                dc,
                stage,
                timer: 0,
            },
        };
        target.state.effects.push(eff as any);
        return eff;
    }

    function diseaseEffect() {
        return target.state.effects.find((e) => e.type === CONSTS.EFFECT_DISEASE);
    }

    function stageEffects(tag: string) {
        return target.state.effects.filter((e) => e.tag === tag);
    }

    // ─── apply ────────────────────────────────────────────────────────────────

    describe('apply', () => {
        it('initialises stage to 0 and timer to 0', () => {
            applyRatSickness(21);
            const d = diseaseEffect();
            expect(d?.data.stage).toBe(0);
            expect(d?.data.timer).toBe(0);
        });

        it('preserves the caller-provided duration on the disease wrapper effect', () => {
            applyRatSickness(21);
            expect(diseaseEffect()?.duration).toBe(Number.MAX_SAFE_INTEGER);
        });

        it('does nothing when duration is 0 (instant / not stored)', () => {
            target.applyEffect(
                EffectDisease.parse({
                    type: CONSTS.EFFECT_DISEASE,
                    disease: CONSTS.DISEASE_RAT_SICKNESS,
                    dc: 21,
                }),
                attacker,
                0
            );
            expect(target.state.effects.length).toBe(0);
        });

        it('applies stage-0 conveyed effects tagged with the stage name', () => {
            applyRatSickness(21);
            // RAT_SICKNESS stage 0 tag = "NAUSEA" → group tag = "RAT_SICKNESS.NAUSEA"
            expect(stageEffects('RAT_SICKNESS.NAUSEA').length).toBeGreaterThan(0);
        });

        it('applies the correct number of conveyed effects for stage 0', () => {
            applyRatSickness(21);
            // NAUSEA: ABILITY_BODY(-1) + SKILL_DISCIPLINE(-2) = 2 effects
            expect(stageEffects('RAT_SICKNESS.NAUSEA').length).toBe(2);
        });
    });

    // ─── mutate — timer ───────────────────────────────────────────────────────

    describe('mutate — timer progression', () => {
        it('increments the timer by 1 each tick', () => {
            pushRatSicknessAtStage(0, 5, 21); // amp=5 so no expiry during test
            target.process();
            expect(diseaseEffect()?.data.timer).toBe(1);
            target.process();
            expect(diseaseEffect()?.data.timer).toBe(2);
        });
    });

    // ─── mutate — resistance ──────────────────────────────────────────────────

    describe('mutate — stage expiry with resistance: true', () => {
        it('removes the disease when the survival check succeeds (dc=1)', () => {
            applyRatSickness(1); // amp=1; after 1 tick timer=1 >= amp=1 → cure
            target.process();
            expect(target.state.effects.some((e) => e.type === CONSTS.EFFECT_DISEASE)).toBe(false);
        });

        it('removes the stage conveyed effects when the disease is cured', () => {
            applyRatSickness(1);
            expect(stageEffects('RAT_SICKNESS.NAUSEA').length).toBeGreaterThan(0);
            target.process();
            expect(stageEffects('RAT_SICKNESS.NAUSEA').length).toBe(0);
        });

        it('advances to the next stage when the survival check fails (dc=21)', () => {
            applyRatSickness(21);
            target.process();
            expect(diseaseEffect()?.data.stage).toBe(1);
        });

        it('removes old stage effects when advancing', () => {
            applyRatSickness(21);
            target.process();
            expect(stageEffects('RAT_SICKNESS.NAUSEA').length).toBe(0);
        });

        it('applies new stage effects when advancing', () => {
            applyRatSickness(21);
            target.process();
            // FEVER is stage 1 of RAT_SICKNESS
            expect(stageEffects('RAT_SICKNESS.FEVER').length).toBeGreaterThan(0);
        });

        it('resets the timer to 0 after stage transition', () => {
            applyRatSickness(21);
            target.process();
            expect(diseaseEffect()?.data.timer).toBe(0);
        });

        it('progresses through all four stages with repeated failures', () => {
            applyRatSickness(21);
            // stage 0 NAUSEA → 1 FEVER → 2 DELIRIUM → 3 CRISIS
            target.process(); // 0→1
            target.process(); // 1→2
            target.process(); // 2→3
            expect(diseaseEffect()?.data.stage).toBe(3);
        });
    });

    // ─── mutate — no resistance ───────────────────────────────────────────────

    describe('mutate — stage with resistance: false (MUMMY_ROT DESSICATION)', () => {
        it('always advances stage without a survival check, even when dc=1 would cure it', () => {
            // MUMMY_ROT stage 1 = DESSICATION (resistance: false)
            // dc=1 would guarantee a cure if the check were made — but it must not be.
            target.state.effects.push({
                id: 'mummy-1',
                type: CONSTS.EFFECT_DISEASE,
                subtype: CONSTS.EFFECT_SUBTYPE_MAGICAL,
                duration: 99999,
                target: target.id,
                source: attacker.id,
                siblings: [],
                tag: '',
                data: {
                    type: CONSTS.EFFECT_DISEASE,
                    amp: 1,
                    disease: CONSTS.DISEASE_MUMMY_ROT,
                    dc: 1,
                    stage: 1, // DESSICATION: resistance: false
                    timer: 0,
                },
            } as any);

            target.process();

            // Must have advanced to stage 2 (CORRUPTION), not been cured
            const d = diseaseEffect();
            expect(d).toBeDefined();
            expect(d?.data.stage).toBe(2);
        });
    });

    // ─── mutate — last stage ──────────────────────────────────────────────────

    describe('mutate — last stage expiry', () => {
        it('removes the disease when the last stage expires and resistance fails', () => {
            // RAT_SICKNESS has 4 stages; CRISIS is index 3 (last), resistance: true
            pushRatSicknessAtStage(3, 1, 21); // amp=1, dc=21 → fails → last → removed
            target.process();
            expect(target.state.effects.some((e) => e.type === CONSTS.EFFECT_DISEASE)).toBe(false);
        });

        it('removes the disease when the last stage expires and resistance succeeds (dc=1)', () => {
            pushRatSicknessAtStage(3, 1, 1);
            target.process();
            expect(target.state.effects.some((e) => e.type === CONSTS.EFFECT_DISEASE)).toBe(false);
        });
    });

    // ─── mutate — periodic damage ─────────────────────────────────────────────

    describe('mutate — periodic damage', () => {
        it('deals damage every tick when periodicity=1 (RAT_SICKNESS CRISIS stage)', () => {
            // Push at CRISIS (stage 3) with large amp so the stage does not expire
            pushRatSicknessAtStage(3, 100, 21);
            const hpStart = target.hitPoints;

            target.process(); // timer 1 → 1%1=0 → dice.roll('1d4')=1 damage
            expect(target.hitPoints).toBe(hpStart - 1);

            target.process(); // timer 2 → 2%1=0 → 1 more damage
            expect(target.hitPoints).toBe(hpStart - 2);
        });

        it('deals no damage in stages without a damages field (NAUSEA)', () => {
            pushRatSicknessAtStage(0, 100, 21); // NAUSEA has no damages field
            const hpStart = target.hitPoints;
            target.process();
            expect(target.hitPoints).toBe(hpStart);
        });
    });

    // ─── dispose ──────────────────────────────────────────────────────────────

    describe('dispose', () => {
        it('removes stage conveyed effects when the disease is externally dispelled', () => {
            const eff = applyRatSickness(21);
            expect(stageEffects('RAT_SICKNESS.NAUSEA').length).toBeGreaterThan(0);

            target.removeEffect(eff, false);

            expect(target.state.effects.some((e) => e.type === CONSTS.EFFECT_DISEASE)).toBe(false);
            expect(stageEffects('RAT_SICKNESS.NAUSEA').length).toBe(0);
        });

        it('does not leave orphaned sibling effects after dispel', () => {
            const eff = applyRatSickness(21);
            const countBefore = target.state.effects.length;
            target.removeEffect(eff, false);
            // only the disease and its stage siblings should be gone
            expect(target.state.effects.length).toBe(0);
        });
    });
});
