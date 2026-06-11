import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Creature } from '../../src/Creature';
import { RulesEngine } from '../../src/RulesEngine';
import { IRulesEngine } from '../../src/interfaces/IRulesEngine';
import { ActionStateSchema } from '../../src/schemas/ActionState';
import { CooldownManager } from '../../src/libs/cooldown';
import { CONSTS } from '../../src/consts';
import { CREATURE_RESREF, makeRulesEngine } from '../RulesEngine/helpers';

describe('RulesEngine — think system', () => {
    let rules: RulesEngine;
    let alice: Creature;
    let bob: Creature;

    beforeEach(() => {
        rules = makeRulesEngine();
        alice = rules.createCreature(CREATURE_RESREF);
        bob = rules.createCreature(CREATURE_RESREF);
    });

    it('creature.rules is set after createCreature', () => {
        expect(alice.rules).toBe(rules);
    });

    it('creature.rules throws after destroyCreature', () => {
        rules.destroyCreature(alice);
        expect(() => alice.rules).toThrow();
    });

    it('PROPERTY_THINK is a valid property type', () => {
        expect(CONSTS.PROPERTY_THINK).toBe('PROPERTY_THINK');
    });

    it('mutate script is called during process() for creatures with PROPERTY_THINK', () => {
        const fn = vi.fn();
        rules.defineScript('ai-basic', fn);
        rules.addCreatureInnateProperty(alice, { type: CONSTS.PROPERTY_THINK, mutate: 'ai-basic' });
        rules.process();
        expect(fn).toHaveBeenCalledOnce();
    });

    it('mutate script receives rules and creature', () => {
        let capturedRules: IRulesEngine | undefined;
        let capturedCreature: Creature | undefined;
        rules.defineScript('ai-inspect', (m: IRulesEngine, creature: Creature) => {
            capturedRules = m;
            capturedCreature = creature;
        });
        rules.addCreatureInnateProperty(alice, {
            type: CONSTS.PROPERTY_THINK,
            mutate: 'ai-inspect',
        });
        rules.process();
        expect(capturedRules).toBe(rules);
        expect(capturedCreature).toBe(alice);
    });

    it('mutate script can start a combat via rules engine parameter', () => {
        rules.defineScript('ai-aggro', (m: IRulesEngine, creature: Creature) => {
            if (!m.isFighting(creature)) {
                m.startCombat(creature, bob);
            }
        });
        rules.addCreatureInnateProperty(alice, { type: CONSTS.PROPERTY_THINK, mutate: 'ai-aggro' });
        rules.process();
        expect(rules.isFighting(alice)).toBe(true);
        expect(rules.getCombatTarget(alice)).toBe(bob);
    });

    it('undeclared thinker scripts are silently skipped', () => {
        rules.addCreatureInnateProperty(alice, {
            type: CONSTS.PROPERTY_THINK,
            mutate: 'no-such-script',
        });
        expect(() => rules.process()).not.toThrow();
    });

    it('scripts without the matching hook are not called', () => {
        const fn = vi.fn();
        rules.defineScript('ai-attack-only', fn);
        rules.addCreatureInnateProperty(alice, {
            type: CONSTS.PROPERTY_THINK,
            attack: 'ai-attack-only',
        });
        rules.process();
        expect(fn).not.toHaveBeenCalled();
    });

    it('mutate enqueues actions that resolve in the matching round', () => {
        const actionFired = vi.fn();
        alice.events.on(CONSTS.EVENT_CREATURE_ACTION, (p: { actionId: string }) => {
            if (p.actionId === 'strike') {
                actionFired();
            }
        });
        rules.startCombat(alice, bob);
        const combat = rules['_combatManager'].getCombat(alice)!;
        combat.setDistance(CONSTS.DISTANCE_CLOSE);
        alice.state.actions['strike'] = ActionStateSchema.parse({
            id: 'strike',
            hostile: true,
            script: 'scripts/strike',
            range: CONSTS.DISTANCE_CLOSE,
            cooldown: CooldownManager.create({ duration: 0, charges: 99 }),
            bonus: false,
        });
        rules.defineScript('ai-strike', (m: IRulesEngine, creature: Creature) => {
            if (!creature.state.actionTaken) {
                m.doAction(creature, 'strike', bob);
            }
        });
        rules.addCreatureInnateProperty(alice, {
            type: CONSTS.PROPERTY_THINK,
            mutate: 'ai-strike',
        });
        // tick 1 → bonus round; tick 2 → normal round fires the queued strike
        rules.process();
        rules.process();
        expect(actionFired).toHaveBeenCalled();
    });
});
