import z from 'zod';
import { EffectAbilityModifier } from './ability-modifier';
import { EffectArmorClassModifier } from './armor-class-modifier';
import { EffectBlindness } from './blindness';
import { EffectDarkvision } from './darkvision';
import { EffectInvisibility } from './invisibility';
import { EffectLight } from './light';
import { EffectRegenerationSchema } from './regeneration';
import { EffectSeeInvisibility } from './see-invisibility';
import { EffectStealth } from './stealth';

export const EffectSchema = z.discriminatedUnion('type', [
    EffectAbilityModifier,
    EffectArmorClassModifier,
    EffectBlindness,
    EffectDarkvision,
    EffectInvisibility,
    EffectLight,
    EffectRegenerationSchema,
    EffectSeeInvisibility,
    EffectStealth,
]);

export type Effect = z.infer<typeof EffectSchema>;
