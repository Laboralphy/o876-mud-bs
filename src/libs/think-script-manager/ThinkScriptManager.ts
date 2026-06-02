import { Creature } from '../../Creature';
import { IManager } from '../../interfaces/IManager';

export type ThinkScriptContext = {
    manager: IManager;
    creature: Creature;
};

export type ThinkScriptFunction = (context: ThinkScriptContext) => void;

export class ThinkScriptManager {
    private readonly _scripts = new Map<string, ThinkScriptFunction>();

    declare(id: string, fn: ThinkScriptFunction): void {
        this._scripts.set(id, fn);
    }

    has(id: string): boolean {
        return this._scripts.has(id);
    }

    invoke(id: string, context: ThinkScriptContext): void {
        const fn = this._scripts.get(id);
        if (fn) {
            fn(context);
        }
    }
}
