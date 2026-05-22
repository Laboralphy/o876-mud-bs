import { CONSTS } from '../../consts';
import { IProgram } from '../../interfaces/IProgram';
import { Effect } from '../schemas';
import { EffectType } from '../../schemas/enums/EffectType';

import { EffectProgramCharm } from './EffectProgramCharm';
import { EffectProgramDamage } from './EffectProgramDamage';
import { EffectProgramDisease } from './EffectProgramDisease';
import { EffectProgramFear } from './EffectProgramFear';
import { EffectProgramHeal } from './EffectProgramHeal';
import { EffectProgramParalysis } from './EffectProgramParalysis';
import { EffectProgramPetrification } from './EffectProgramPetrification';
import { EffectProgramPoison } from './EffectProgramPoison';
import { EffectProgramRegeneration } from './EffectProgramRegeneration';
import { EffectProgramRoot } from './EffectProgramRoot';
import { EffectProgramStun } from './EffectProgramStun';

export const effectPrograms = new Map<EffectType, IProgram<Effect>>([
    [CONSTS.EFFECT_CHARM, new EffectProgramCharm()],
    [CONSTS.EFFECT_DAMAGE, new EffectProgramDamage()],
    [CONSTS.EFFECT_DISEASE, new EffectProgramDisease()],
    [CONSTS.EFFECT_FEAR, new EffectProgramFear()],
    [CONSTS.EFFECT_HEAL, new EffectProgramHeal()],
    [CONSTS.EFFECT_PARALYSIS, new EffectProgramParalysis()],
    [CONSTS.EFFECT_PETRIFICATION, new EffectProgramPetrification()],
    [CONSTS.EFFECT_POISON, new EffectProgramPoison()],
    [CONSTS.EFFECT_REGENERATION, new EffectProgramRegeneration()],
    [CONSTS.EFFECT_ROOT, new EffectProgramRoot()],
    [CONSTS.EFFECT_STUN, new EffectProgramStun()],
]);
