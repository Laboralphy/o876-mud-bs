import z from 'zod';
import { PropertySchemaAbilityModifier } from './ability-modifier';
import { PropertyArmorClassModifier } from './armor-class-modifier';
import { PropertySchemaRegeneration } from './regeneration';

export const PropertySchema = z.discriminatedUnion('type', [
    PropertySchemaAbilityModifier,
    PropertyArmorClassModifier,
    PropertySchemaRegeneration,
]);

export type Property = z.infer<typeof PropertySchema>;
