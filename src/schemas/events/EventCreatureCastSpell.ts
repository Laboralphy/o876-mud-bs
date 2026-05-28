import z from 'zod';
import { Creature } from '../../Creature';
import { ItemSchema } from '../Item';

export const EventCreatureCastSpellSchema = z.strictObject({
    creature: z.instanceof(Creature),
    spellId: z.string(),
    target: z.instanceof(Creature).optional(),
    item: ItemSchema.optional(),
});

export type EventCreatureCastSpell = z.infer<typeof EventCreatureCastSpellSchema>;
