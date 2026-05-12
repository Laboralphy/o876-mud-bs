import z from 'zod';
import { ItemSchema } from './Item';
import { EquipmentSlotSchema } from './enums/EquipmentSlot';

export const EquipmentSchema = z.record(EquipmentSlotSchema, ItemSchema.nullable());
