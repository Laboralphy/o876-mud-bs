import z from 'zod';
import { Creature } from '../../Creature';
import { EffectSchema } from '../../effects';

/**
 * This schema validates all event that have creature / effect properties
 */
export const EventEffectProcessorCreatureEffectSchema = z.object({
    creature: z.instanceof(Creature),
    effect: EffectSchema,
});

export type EventEffectProcessorCreatureEffect = z.infer<
    typeof EventEffectProcessorCreatureEffectSchema
>;
