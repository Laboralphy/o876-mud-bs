import { EffectDefinitionSchema } from '../effects/schemas';
import z from 'zod';
import { DiceExpression } from './DiceExpression';
import { DamageTypeSchema } from './enums/DamageType';

export const DiseaseStageSchema = z.strictObject({
    tag: z.string(), // local tag of the stage, this tag is append to the disease tag
    // when reaching a new stage, all effect of the previous stage are dispelled
    duration: DiceExpression, // duration of the stage, in "days"
    resistance: z.boolean(), // if true, then a survival resistance check is allowed
    conveyedEffects: z.array(EffectDefinitionSchema), // List of effect conveyed in this stage : all effects have the same duration of the stage
    damages: z.strictObject({
        damageType: DamageTypeSchema,
        amount: DiceExpression,
        periodicity: z.number().int(),
    }).optional(),
    // special : damage effect are instant effect (duration 0) repeated each stage tick
});

export const DiseaseDefinitionSchema = z.strictObject({
    tag: z.string(), // the main tag of the diseases : cannot have two disease of the same tag.
    dc: z.number(), // the overall difficulty class of the disease
    stages: z.array(DiseaseStageSchema),
});
