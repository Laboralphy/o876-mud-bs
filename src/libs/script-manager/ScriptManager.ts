import { Creature } from '../../Creature';

export type ActionScriptFunction = (creature: Creature, target: Creature | undefined) => void;

export class ScriptManager {
    private readonly _scripts = new Map<string, ActionScriptFunction>();

    /**
     * Registers an action script under the given id.
     * Overwrites any previously registered script with the same id.
     */
    declareScript(id: string, fn: ActionScriptFunction): void {
        this._scripts.set(id, fn);
    }

    /** Returns true if an action script has been declared under `id`. */
    hasScript(id: string): boolean {
        return this._scripts.has(id);
    }

    /**
     * Invokes the action script registered under `id`.
     * Throws if no script has been declared for that id.
     */
    runScript(id: string, creature: Creature, target: Creature | undefined): void {
        const fn = this._scripts.get(id);
        if (!fn) {
            throw new Error(`No action script declared for id "${id}"`);
        }
        fn(creature, target);
    }
}
