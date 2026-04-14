import { z } from 'zod';
import { CONSTS } from '../../consts';

export const PropertySchemaRegeneration = z.strictObject({
    type: z.literal(CONSTS.PROPERTY_ABILITY_MODIFIER),
    amp: z.number().int(),
});
