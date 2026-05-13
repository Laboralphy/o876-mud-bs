import z from 'zod';
import { Creature } from '../../Creature';
import { ItemSchema } from '../Item';
import { EquipmentSlotSchema } from '../enums/EquipmentSlot';
import { EquipItemOutcomeSchema } from '../enums/EquipItemOutcome';

export const EventCreatureEquipItemFailedSchema = z.strictObject({
    creature: z.instanceof(Creature),
    item: ItemSchema,
    slot: EquipmentSlotSchema.optional(),
    reason: EquipItemOutcomeSchema,
});

export type EventCreatureEquipItemFailed = z.infer<typeof EventCreatureEquipItemFailedSchema>;
