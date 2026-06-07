import z from 'zod';
import { Creature } from '../../Creature';
import { ThreatSchema } from '../enums/Threat';

export const EventCreatureCheckResistanceSchema = z.strictObject({
    creature: z.instanceof(Creature),
    threat: ThreatSchema,
    bonus: z.number(),
    dc: z.number().int(),
    success: z.boolean(),
});

export type EventCreatureCheckResistance = z.infer<typeof EventCreatureCheckResistanceSchema>;
