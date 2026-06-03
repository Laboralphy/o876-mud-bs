import { Creature } from '../../Creature';
import { IManager } from '../../interfaces/IManager';

export type ActionScriptFunction = (manager: IManager, creature: Creature, target: Creature | undefined) => void;

export class ScriptManager {
    private readonly _scripts = new Map<string, ActionScriptFunction>();

    /**
     * Registers a script under the given id.
     * Overwrites any previously registered script with the same id.
     */
    declareScript(id: string, fn: ActionScriptFunction): void {
        this._scripts.set(id, fn);
    }

    /** Returns true if a script has been declared under `id`. */
    hasScript(id: string): boolean {
        return this._scripts.has(id);
    }

    /**
     * Invokes the script registered under `id`.
     * Throws if no script has been declared for that id.
     */
    runScript(id: string, manager: IManager, creature: Creature, target: Creature | undefined): void {
        const fn = this._scripts.get(id);
        if (!fn) {
            throw new Error(`No script declared for id "${id}"`);
        }
        fn(manager, creature, target);
    }
}
