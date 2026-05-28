import { IProgram } from '../../interfaces/IProgram';
import { Effect } from '../schemas';
import { Creature } from '../../Creature';
import { CONSTS } from '../../consts';

export class EffectProgramHeal implements IProgram<Effect> {
    private _heal(amp: number, creature: Creature, source: Creature | undefined): void {
        const { modifier, factor } = creature.getters.getHealingFactor;
        const amount = Math.max(0, Math.floor((amp + modifier) * factor));
        if (amount > 0) {
            creature.hitPoints += amount;
            creature.emit(CONSTS.EVENT_CREATURE_HEAL, { creature, amount, healer: source });
        }
    }

    mutate(effect: Effect, creature: Creature, source: Creature | undefined): void {
        if (effect.type === CONSTS.EFFECT_HEAL) {
            this._heal(effect.data.amp, creature, source);
        }
    }

    apply(effect: Effect, creature: Creature, source: Creature | undefined): void {
        if (effect.type === CONSTS.EFFECT_HEAL) {
            this._heal(effect.data.amp, creature, source);
        }
    }
}
