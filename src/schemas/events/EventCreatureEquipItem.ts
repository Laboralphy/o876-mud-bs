import z from 'zod';
import { Creature } from '../../Creature';
import { ItemSchema } from '../Item';
import { EquipmentSlotSchema } from '../enums/EquipmentSlot';

export const EventCreatureEquipItemSchema = z.strictObject({
    creature: z.instanceof(Creature),
    item: ItemSchema,
    slot: EquipmentSlotSchema,
});

export type EventCreatureEquipItem = z.infer<typeof EventCreatureEquipItemSchema>;
