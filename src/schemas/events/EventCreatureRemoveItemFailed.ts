import z from 'zod';
import { Creature } from '../../Creature';
import { ItemSchema } from '../Item';
import { EquipmentSlotSchema } from '../enums/EquipmentSlot';
import { EquipItemOutcomeSchema } from '../enums/EquipItemOutcome';

export const EventCreatureRemoveItemFailedSchema = z.strictObject({
    creature: z.instanceof(Creature),
    item: ItemSchema,
    slot: EquipmentSlotSchema.optional(),
    reason: EquipItemOutcomeSchema,
});

export type EventCreatureRemoveItemFailed = z.infer<typeof EventCreatureRemoveItemFailedSchema>;
