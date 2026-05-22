import { IProgram } from '../../interfaces/IProgram';
import { Effect } from '../schemas';
import { Creature } from '../../Creature';
import { CONSTS } from '../../consts';

export class EffectProgramHeal implements IProgram<Effect> {
    private _heal(amp: number, creature: Creature): void {
        const { modifier, factor } = creature.getters.getHealingFactor;
        const amount = Math.max(0, Math.floor((amp + modifier) * factor));
        if (amount > 0) {
            creature.hitPoints += amount;
        }
    }

    mutate(effect: Effect, creature: Creature, source: Creature | undefined): void {
        if (effect.type === CONSTS.EFFECT_HEAL) {
            this._heal(effect.data.amp, creature);
        }
    }

    apply(effect: Effect, creature: Creature, source: Creature | undefined): void {
        if (effect.type === CONSTS.EFFECT_HEAL) {
            this._heal(effect.data.amp, creature);
        }
    }
}
