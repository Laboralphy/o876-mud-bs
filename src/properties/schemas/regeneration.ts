import { z } from 'zod';
import { CONSTS } from '../../consts';
import { DamageTypeSchema } from '../../schemas/enums/DamageType';
import { AmpExpressionSchema } from '../../schemas/AmpExpression';

export const PropertySchemaRegeneration = z.strictObject({
    type: z.literal(CONSTS.PROPERTY_REGENERATION),
    amp: AmpExpressionSchema, // normal amount of hp regain per turn
    vulnerabilities: z.array(DamageTypeSchema), // list of damage types that the regeneration is vulnerable to (increase shutdown)
    useBodyModifier: z.boolean().optional().default(false), // if true, regeneration will use the body modifier as a bonus to amp
    shutdown: z.number().int().optional().default(0), // This is a working property, if > 0, regeneration will stop until this value is soaked down
    threshold: z.number().optional().default(0), // Above this value (hp/hpmax) the regeneration won't work
});

export type PropertyRegeneration = z.infer<typeof PropertySchemaRegeneration>;
