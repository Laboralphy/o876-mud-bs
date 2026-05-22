import z from 'zod';
import { CONSTS } from '../../../consts';
import { DamageTypeSchema } from '../../../schemas/enums/DamageType';
import { DiceExpression } from '../../../schemas/DiceExpression';

export const PropertyDamageReduction = z.strictObject({
    type: z.literal(CONSTS.PROPERTY_DAMAGE_REDUCTION),
    amp: DiceExpression,
    damageType: DamageTypeSchema,
});
