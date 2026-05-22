import { IProgram } from '../../interfaces/IProgram';
import { Effect } from '../schemas';
import { Creature } from '../../Creature';
import { CONSTS } from '../../consts';
import { DamageType } from '../../schemas/enums/DamageType';

export class EffectProgramParalysis implements IProgram<Effect> {
    damaged(
        effect: Effect,
        amount: number,
        damageType: DamageType,
        creature: Creature,
        source: Creature | undefined
    ): void {
        if (effect.type === CONSTS.EFFECT_PARALYSIS) {
            const dc = effect.data.dc ?? 0;
            if (dc > 0 && creature.checkSkill(CONSTS.SKILL_ATHLETICS, dc)) {
                creature.removeEffect(effect);
            }
        }
    }
}
