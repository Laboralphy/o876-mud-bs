import { IProgram } from '../../interfaces/IProgram';
import { Effect } from '../schemas';
import { Creature } from '../../Creature';
import { CONSTS } from '../../consts';

export class EffectProgramDamage implements IProgram<Effect> {
    apply(propOrEffect: Effect, creature: Creature) {
        if (propOrEffect.type === CONSTS.EFFECT_DAMAGE) {
            const p = propOrEffect.data;
            const { damageType, amp } = p;
            // TODO checks damage immunity for this type
            // TODO checks damage vulnerability for this type
            // TODO checks damage reduction for this type
            // TODO checks damage resistance for this type
        }
    }
}
