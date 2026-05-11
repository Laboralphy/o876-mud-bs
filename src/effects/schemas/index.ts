import z from 'zod';
import { EffectAbilityModifier } from './ability-modifier';
import { EffectArmorClassModifier } from './armor-class-modifier';
import { EffectRegenerationSchema } from './regeneration';

export const EffectSchema = z.discriminatedUnion('type', [
    EffectAbilityModifier,
    EffectArmorClassModifier,
    EffectRegenerationSchema,
]);

export type Effect = z.infer<typeof EffectSchema>;
