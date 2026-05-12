import { CONSTS } from '../../consts';
import { IProgram } from '../../interfaces/IProgram';
import { Effect } from '../schemas';
import { EffectType } from '../../schemas/enums/EffectType';

import { EffectProgramRegeneration } from './EffectProgramRegeneration';

export const effectPrograms = new Map<EffectType, IProgram<Effect>>([
    [CONSTS.EFFECT_REGENERATION, new EffectProgramRegeneration()],
]);
