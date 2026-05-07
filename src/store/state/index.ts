import z from 'zod';
import { CONSTS } from '../../consts';
import { PropertySchema } from '../../schemas/Property';

export const StateSchema = z.object({
    abilities: z.object({
        [CONSTS.ABILITY_BODY]: z.number().int().min(0),
        [CONSTS.ABILITY_SENSE]: z.number().int().min(0),
        [CONSTS.ABILITY_MIND]: z.number().int().min(0),
        [CONSTS.ABILITY_PRESENCE]: z.number().int().min(0),
    }),
    properties: z.array(PropertySchema),
});

export type State = z.infer<typeof StateSchema>;
