import { CONSTS } from '../../consts';
import { IProgram } from '../../interfaces/IProgram';
import { Effect } from '../schemas';
import { EffectType } from '../../schemas/enums/EffectType';

import { EffectProgramDamage } from './EffectProgramDamage';
import { EffectProgramHeal } from './EffectProgramHeal';
import { EffectProgramRegeneration } from './EffectProgramRegeneration';

export const effectPrograms = new Map<EffectType, IProgram<Effect>>([
    [CONSTS.EFFECT_DAMAGE, new EffectProgramDamage()],
    [CONSTS.EFFECT_HEAL, new EffectProgramHeal()],
    [CONSTS.EFFECT_REGENERATION, new EffectProgramRegeneration()],
]);
