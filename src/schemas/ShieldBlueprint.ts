import z from 'zod';
import { CONSTS } from '../consts';
import { EquipmentSlotSchema } from './enums/EquipmentSlot';
import { ProficiencySchema } from './enums/Proficiency';
import { PropertySchema } from '../properties';

export const ShieldBlueprintSchema = z.strictObject({
    entityType: z.literal(CONSTS.ENTITY_TYPE_ITEM).describe('fields.entityType'),
    properties: z.array(PropertySchema),
    weight: z.number().min(0).describe('fields.weight'),
    itemType: z.literal(CONSTS.ITEM_TYPE_SHIELD).describe('fields.itemType'),
    armorClass: z.number().int().describe('fields.ac'),
    proficiency: ProficiencySchema,
    equipmentSlots: z.array(EquipmentSlotSchema),
});

export type ShieldBlueprint = z.infer<typeof ShieldBlueprintSchema>;
