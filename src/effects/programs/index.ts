import { CONSTS } from '../../consts';
import { IProgram } from '../../interfaces/IProgram';
import { Effect } from '../schemas';

import { EffectProgramRegeneration } from './EffectProgramRegeneration';

export const effectPrograms = new Map<string, IProgram<Effect>>([
    [CONSTS.EFFECT_REGENERATION, new EffectProgramRegeneration()],
]);
