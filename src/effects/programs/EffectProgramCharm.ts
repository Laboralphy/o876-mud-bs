import { IProgram } from '../../interfaces/IProgram';
import { Effect } from '../schemas';
import { CONSTS } from '../../consts';
import { Attack } from '../../Attack';
import { getResistingSkill } from '../../libs/get-resisting-skill';

export class EffectProgramCharm implements IProgram<Effect> {
    attacked(effect: Effect, attack: Attack): void {
        if (effect.type === CONSTS.EFFECT_CHARM && attack.attacker.id === effect.source) {
            const dc = effect.data.dc ?? 0;
            const skill = getResistingSkill(effect.type);
            if (dc > 0 && skill && attack.target.checkSkill(skill, dc)) {
                attack.target.removeEffect(effect);
            }
        }
    }
}
