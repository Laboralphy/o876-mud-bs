import z from 'zod';
import { PropertySchemaAbilityModifier } from './ability-modifier';
import { PropertyArmorClassModifier } from './armor-class-modifier';
import { PropertyDarkvision } from './darkvision';
import { PropertyLight } from './light';
import { PropertySchemaRegeneration } from './regeneration';

export const PropertySchema = z.discriminatedUnion('type', [
    PropertySchemaAbilityModifier,
    PropertyArmorClassModifier,
    PropertyDarkvision,
    PropertyLight,
    PropertySchemaRegeneration,
]);

export type Property = z.infer<typeof PropertySchema>;
