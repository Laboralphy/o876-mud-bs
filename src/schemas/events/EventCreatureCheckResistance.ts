import z from 'zod';
import { Creature } from '../../Creature';
import { AbilitySchema } from '../enums/Ability';
import { ThreatTypeSchema } from '../enums/ThreatType';

export const EventCreatureCheckResistanceSchema = z.strictObject({
    creature: z.instanceof(Creature),
    ability: AbilitySchema,
    dc: z.number().int(),
    threat: ThreatTypeSchema.optional(),
    success: z.boolean(),
});

export type EventCreatureCheckResistance = z.infer<typeof EventCreatureCheckResistanceSchema>;
