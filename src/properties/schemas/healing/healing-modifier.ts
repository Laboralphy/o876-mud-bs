import z from 'zod';
import { CONSTS } from '../../../consts';
import { DiceExpression } from '../../../schemas/DiceExpression';

export const PropertyHealingModifier = z.strictObject({
    type: z.literal(CONSTS.PROPERTY_HEALING_MODIFIER),
    amp: DiceExpression,
});
