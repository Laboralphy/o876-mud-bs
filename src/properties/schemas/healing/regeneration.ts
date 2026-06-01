import { z } from 'zod';
import { CONSTS } from '../../../consts';
import { DamageTypeSchema } from '../../../schemas/enums/DamageType';
import { DiceExpression } from '../../../schemas/DiceExpression';

export const PropertyRegeneration = z.strictObject({
    type: z.literal(CONSTS.PROPERTY_REGENERATION),
    amp: DiceExpression.describe('PropertyRegeneration.amp'),
    vulnerabilities: z.array(DamageTypeSchema).optional().describe('PropertyRegeneration.vulnerabilities'),
    useBodyModifier: z.boolean().optional().default(false).describe('PropertyRegeneration.useBodyModifier'),
    shutdown: z.number().int().optional().default(0).describe('PropertyRegeneration.shutdown'),
    threshold: z.number().optional().default(0).describe('PropertyRegeneration.threshold'),
}).describe('PropertyRegeneration');
