import z from 'zod';

import { PropertySchemaAbilityModifier } from '../properties/schemas/ability-modifier';

export const PropertySchema = z.discriminatedUnion('type', [PropertySchemaAbilityModifier]);

export type Property = z.infer<typeof PropertySchema>;
