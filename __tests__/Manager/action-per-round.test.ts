import { beforeEach, describe, expect, it } from 'vitest';
import { Creature } from '../../src/Creature';
import { CooldownManager } from '../../src/libs/cooldown';
import { ActionStateSchema } from '../../src/schemas/Action';
import { CREATURE_RESREF, makeManager } from './helpers';
import { CONSTS } from '../../src/consts';

describe('Creature — action per round', () => {
    let creature: Creature;
    let target: Creature;

    beforeEach(() => {
        const manager = makeManager();
        creature = manager.createCreature(CREATURE_RESREF);
        target = manager.createCreature(CREATURE_RESREF);
        creature.state.actions['strike'] = ActionStateSchema.parse({
            id: 'strike',
            hostile: true,
            script: 'scripts/strike',
            range: CONSTS.DISTANCE_CLOSE,
            cooldown: CooldownManager.create({ duration: 10, charges: 3 }),
            bonus: false,
        });
        creature.state.actions['quickstep'] = ActionStateSchema.parse({
            id: 'quickstep',
            hostile: false,
            script: 'scripts/quickstep',
            range: CONSTS.DISTANCE_CLOSE,
            cooldown: CooldownManager.create({ duration: 10, charges: 3 }),
            bonus: true,
        });
    });

    describe('normal action', () => {
        it('succeeds on the first call', () => {
            const result = creature.doAction('strike', target);
            expect(result.success).toBe(true);
        });

        it('fails on the second call in the same round', () => {
            creature.doAction('strike', target);
            const result = creature.doAction('strike', target);
            expect(result.success).toBe(false);
        });

        it('succeeds again after creature.process()', () => {
            creature.doAction('strike', target);
            creature.process();
            const result = creature.doAction('strike', target);
            expect(result.success).toBe(true);
        });
    });

    describe('bonus action', () => {
        it('succeeds on the first call', () => {
            const result = creature.doAction('quickstep', undefined);
            expect(result.success).toBe(true);
        });

        it('fails on the second call in the same round', () => {
            creature.doAction('quickstep', undefined);
            const result = creature.doAction('quickstep', undefined);
            expect(result.success).toBe(false);
        });

        it('succeeds again after creature.process()', () => {
            creature.doAction('quickstep', undefined);
            creature.process();
            const result = creature.doAction('quickstep', undefined);
            expect(result.success).toBe(true);
        });
    });

    describe('normal + bonus in the same round', () => {
        it('can take one normal action and one bonus action in the same round', () => {
            const r1 = creature.doAction('strike', target);
            const r2 = creature.doAction('quickstep', undefined);
            expect(r1.success).toBe(true);
            expect(r2.success).toBe(true);
        });

        it('cannot take a second normal action after a normal + bonus round', () => {
            creature.doAction('strike', target);
            creature.doAction('quickstep', undefined);
            const result = creature.doAction('strike', target);
            expect(result.success).toBe(false);
        });

        it('cannot take a second bonus action after a normal + bonus round', () => {
            creature.doAction('strike', target);
            creature.doAction('quickstep', undefined);
            const result = creature.doAction('quickstep', undefined);
            expect(result.success).toBe(false);
        });
    });
});
