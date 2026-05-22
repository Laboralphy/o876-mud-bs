import { IProgram } from '../../interfaces/IProgram';
import { Effect } from '../schemas';
import { Creature } from '../../Creature';
import { CONSTS } from '../../consts';
import { DamageType } from '../../schemas/enums/DamageType';

export class EffectProgramDamage implements IProgram<Effect> {
    private _deal(damageType: DamageType, amp: number, creature: Creature, source: Creature | undefined): void {
        const entry = creature.getters.getDamageMitigation.get(damageType);
        const reduction = entry?.reduction ?? 0;
        const factor = entry?.factor ?? 1;
        const amount = Math.max(0, Math.floor((amp - reduction) * factor));
        if (amount > 0) {
            creature.hitPoints -= amount;
            creature.triggerDamagedEvent(amount, damageType, source);
        }
    }

    mutate(effect: Effect, creature: Creature, source: Creature | undefined): void {
        if (effect.type === CONSTS.EFFECT_DAMAGE) {
            const { damageType, amp } = effect.data;
            this._deal(damageType, amp, creature, source);
        }
    }

    apply(effect: Effect, creature: Creature, source: Creature | undefined): void {
        if (effect.type === CONSTS.EFFECT_DAMAGE) {
            const { damageType, amp } = effect.data;
            this._deal(damageType, amp, creature, source);
        }
    }
}
