import z from 'zod';
import { Creature } from '../../Creature';
import { AbilitySchema } from '../enums/Ability';

export const EventCreatureCheckResistanceSchema = z.strictObject({
    creature: z.instanceof(Creature),
    ability: AbilitySchema,
    dc: z.number().int(),
    success: z.boolean(),
});

export type EventCreatureCheckResistance = z.infer<typeof EventCreatureCheckResistanceSchema>;
