import { IProgram } from '../../interfaces/IProgram';
import { Effect } from '../schemas';
import { CONSTS } from '../../consts';
import { Attack } from '../../Attack';
export class EffectProgramCharm implements IProgram<Effect> {
    attacked(effect: Effect, attack: Attack): void {
        if (effect.type === CONSTS.EFFECT_CHARM && attack.attacker.id === effect.source) {
            const dc = effect.data.dc ?? 0;
            if (dc > 0 && attack.target.checkResistance(CONSTS.THREAT_CHARM, dc)) {
                attack.target.removeEffect(effect);
            }
        }
    }
}
