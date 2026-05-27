import z from 'zod';
import { CONSTS } from '../../../consts';
import { ImmunitySchema } from '../../../schemas/enums/Immunity';

export const PropertyImmunity = z.strictObject({
    type: z.literal(CONSTS.PROPERTY_IMMUNITY),
    immunityType: ImmunitySchema,
});
