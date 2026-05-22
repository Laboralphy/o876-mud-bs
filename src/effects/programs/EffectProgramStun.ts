import { IProgram } from '../../interfaces/IProgram';
import { Effect } from '../schemas';
import { Creature } from '../../Creature';
import { CONSTS } from '../../consts';
import { DamageType } from '../../schemas/enums/DamageType';
import { getResistingSkill } from '../../libs/get-resisting-skill';

export class EffectProgramStun implements IProgram<Effect> {
    damaged(
        effect: Effect,
        amount: number,
        damageType: DamageType,
        creature: Creature,
        source: Creature | undefined
    ): void {
        if (effect.type === CONSTS.EFFECT_STUN) {
            const dc = effect.data.dc ?? 0;
            const skill = getResistingSkill(effect.type);
            if (dc > 0 && skill && creature.checkSkill(skill, dc)) {
                creature.removeEffect(effect);
            }
        }
    }
}
