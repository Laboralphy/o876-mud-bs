import z from 'zod';
import { CONSTS } from '../../../consts';
import { ImmunitySchema } from '../../../schemas/enums/Immunity';

export const EffectImmunity = z.strictObject({
    type: z.literal(CONSTS.EFFECT_IMMUNITY),
    immunityType: ImmunitySchema,
});
