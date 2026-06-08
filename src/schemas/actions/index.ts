import { z } from 'zod';
import { CaElementalBreathActionSchema } from './ca-elemental-breath';

export const ActionBlueprintSchema = z.discriminatedUnion('script', [
    CaElementalBreathActionSchema,
]);

export type ActionBlueprint = z.infer<typeof ActionBlueprintSchema>;
