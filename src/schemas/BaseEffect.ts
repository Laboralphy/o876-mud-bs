import z from 'zod';
import { EffectSubtypeSchema } from './enums/EffectSubtype';
import { EffectTypeSchema } from './enums/EffectType';

/**
 * This schema define the base structure of an effect in order to manager these effects
 * properly by updating duration, keeping reference to target ans source creature
 * and knowing all effect siblings (when an effect is dispelled, all its siblings are dispelled)
 */
export const BaseEffectSchema = z.object({
    id: z.string(),
    type: EffectTypeSchema,
    subtype: EffectSubtypeSchema, // define how the effect can be dispelled
    duration: z.number().int().min(0), // effect duration in turns
    target: z.string(), // reference to the target creature
    source: z.string(), // reference to the source creature (the one that cast the effect)
    siblings: z.array(z.string()), // in reference to the sibling effects, one effect dispelled will dispel all its siblings
    tag: z.string(), // effects of the same tag cannot stack
});
