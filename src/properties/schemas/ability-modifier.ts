import { z } from 'zod';
import { AbilitySchema } from '../../schemas/enums/Ability';
import { CONSTS } from '../../consts';

export const PropertySchemaAbilityModifier = z.strictObject({
    type: z.literal(CONSTS.PROPERTY_ABILITY_MODIFIER),
    amp: z.number().int(), // ability modifier
    ability: AbilitySchema, // what ability is modified
});
