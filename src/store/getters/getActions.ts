import { State } from '../state';
import { GetterReturnType } from '../define-getters';

export type ActionStatus = {
    id: string;
    script: string;
    ready: boolean;
    charges: number;
    maxCharges: number;
    cooldown: number;
    bonus: boolean;
};

export function getActions(state: State): ActionStatus[] {
    return Object.values(state.actions).map((action) => {
        const { timers, timerMaxCount } = action.cooldown;
        const charges = timerMaxCount - timers.length;
        let ready: boolean = true;
        if (state.bonusActionTaken && action.bonus) {
            ready = false;
        }
        if (state.actionTaken && !action.bonus) {
            ready = false;
        }
        ready = ready && charges > 0;
        const cooldown = ready ? 0 : timers[0];
        return {
            id: action.id,
            script: action.script,
            ready,
            charges,
            bonus: action.bonus,
            maxCharges: timerMaxCount,
            cooldown,
        };
    });
}
