import { z } from 'zod';
import { AbilitySchema } from '../schemas/enums/abilities';
import { CONSTS } from '../consts';

const PropertyAbilityModifierSchema = z.strictObject({
    type: z.literal(CONSTS.PROPERTY_ABILITY_MODIFIER),
    amp: z.number().int(),
    ability: AbilitySchema,
});
