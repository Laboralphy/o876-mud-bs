import z from 'zod';
import { Creature } from '../../Creature';
import { DamageTypeSchema } from '../enums/DamageType';

export const EventCreatureDamagedSchema = z.strictObject({
    creature: z.instanceof(Creature),
    amount: z.number().int().min(0),
    damageType: DamageTypeSchema,
    source: z.instanceof(Creature).optional(),
});

export type EventCreatureDamaged = z.infer<typeof EventCreatureDamagedSchema>;
