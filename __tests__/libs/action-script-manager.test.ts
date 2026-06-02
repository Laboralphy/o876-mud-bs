import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ActionScriptManager } from '../../src/libs/action-script-manager';
import { makeManager } from '../Manager/helpers';
import { CooldownManager } from '../../src/libs/cooldown';
import { ActionStateSchema } from '../../src/schemas/Action';
import { CONSTS } from '../../src/consts';

describe('ActionScriptManager', () => {
    let asm: ActionScriptManager;

    beforeEach(() => {
        asm = new ActionScriptManager();
    });

    // ─── declareActionScript ──────────────────────────────────────────────────

    describe('declareActionScript', () => {
        it('registers a script so hasScript returns true', () => {
            asm.declareActionScript('fireball', vi.fn());
            expect(asm.hasScript('fireball')).toBe(true);
        });

        it('overwrites a previously registered script', () => {
            const first = vi.fn();
            const second = vi.fn();
            asm.declareActionScript('fireball', first);
            asm.declareActionScript('fireball', second);
            const manager = makeManager();
            const creature = manager.createCreature('test-creature');
            asm.invokeActionScript('fireball', creature, undefined);
            expect(first).not.toHaveBeenCalled();
            expect(second).toHaveBeenCalledOnce();
        });
    });

    // ─── hasScript ────────────────────────────────────────────────────────────

    describe('hasScript', () => {
        it('returns false for an undeclared id', () => {
            expect(asm.hasScript('unknown')).toBe(false);
        });

        it('returns true after declaration', () => {
            asm.declareActionScript('heal', vi.fn());
            expect(asm.hasScript('heal')).toBe(true);
        });
    });

    // ─── invokeActionScript ───────────────────────────────────────────────────

    describe('invokeActionScript', () => {
        it('calls the registered function', () => {
            const fn = vi.fn();
            asm.declareActionScript('smite', fn);
            const manager = makeManager();
            const creature = manager.createCreature('test-creature');
            const target = manager.createCreature('test-creature');
            asm.invokeActionScript('smite', creature, target);
            expect(fn).toHaveBeenCalledOnce();
        });

        it('passes creature and target to the function', () => {
            const fn = vi.fn();
            asm.declareActionScript('smite', fn);
            const manager = makeManager();
            const creature = manager.createCreature('test-creature');
            const target = manager.createCreature('test-creature');
            asm.invokeActionScript('smite', creature, target);
            expect(fn).toHaveBeenCalledWith(creature, target);
        });

        it('passes undefined target when there is no target', () => {
            const fn = vi.fn();
            asm.declareActionScript('shout', fn);
            const manager = makeManager();
            const creature = manager.createCreature('test-creature');
            asm.invokeActionScript('shout', creature, undefined);
            expect(fn).toHaveBeenCalledWith(creature, undefined);
        });

        it('throws when the script id is not registered', () => {
            const manager = makeManager();
            const creature = manager.createCreature('test-creature');
            expect(() => asm.invokeActionScript('unknown', creature, undefined)).toThrow(
                'No action script declared for id "unknown"'
            );
        });
    });

    // ─── Manager integration ──────────────────────────────────────────────────

    describe('Manager integration', () => {
        it('invokes the script when doAction fires the action event', () => {
            const manager = makeManager();
            const fn = vi.fn();
            manager.scripts.declareActionScript('scripts/fireball', fn);
            const creature = manager.createCreature('test-creature');
            const target = manager.createCreature('test-creature');
            creature.state.actions['fireball'] = ActionStateSchema.parse({
                id: 'fireball',
                hostile: true,
                script: 'scripts/fireball',
                range: CONSTS.DISTANCE_CLOSE,
                cooldown: CooldownManager.create({ duration: 10, charges: 2 }),
                bonus: false,
            });
            creature.doAction('fireball', target);
            expect(fn).toHaveBeenCalledOnce();
            expect(fn).toHaveBeenCalledWith(creature, target);
        });

        it('does not throw when doAction fires for an unregistered script', () => {
            const manager = makeManager();
            const creature = manager.createCreature('test-creature');
            creature.state.actions['zap'] = ActionStateSchema.parse({
                id: 'zap',
                hostile: true,
                script: 'scripts/zap',
                range: CONSTS.DISTANCE_CLOSE,
                cooldown: CooldownManager.create({ duration: 10, charges: 2 }),
                bonus: false,
            });
            expect(() => creature.doAction('zap', undefined)).not.toThrow();
        });
    });
});
