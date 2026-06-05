import z from 'zod';
import { CONSTS } from '../../../consts';
import { DamageTypeSchema } from '../../../schemas/enums/DamageType';

export const PropertyVampyre = z.strictObject({
    type: z.literal(CONSTS.PROPERTY_VAMPYRE),
    amp: z.number(),
    damageType: DamageTypeSchema,
});
