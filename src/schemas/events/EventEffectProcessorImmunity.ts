import z from 'zod';
import { Creature } from '../../Creature';
import { EffectSchema } from '../../effects';

/**
 * This schema validates immunity interrogation
 * handlers are welcome to call "immune" to reject effect
 */
export const EventEffectProcessorImmunitySchema = z.object({
    creature: z.instanceof(Creature),
    effect: EffectSchema,
    immune: z.function({
        input: [],
        output: z.void(),
    }),
});

export type EventEffectProcessorImmunity = z.infer<typeof EventEffectProcessorImmunitySchema>;
