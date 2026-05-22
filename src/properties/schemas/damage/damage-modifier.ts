import z from 'zod';
import { CONSTS } from '../../../consts';
import { DamageTypeSchema } from '../../../schemas/enums/DamageType';
import { DiceExpression } from '../../../schemas/DiceExpression';

export const PropertyDamageModifier = z.strictObject({
    type: z.literal(CONSTS.PROPERTY_DAMAGE_MODIFIER),
    amp: DiceExpression,
    damageType: DamageTypeSchema,
});
