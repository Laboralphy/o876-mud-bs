import z from 'zod';
import { CONSTS } from '../consts';
import { EquipmentSlotSchema } from './enums/EquipmentSlot';
import { ProficiencySchema } from './enums/Proficiency';
import { PropertyDefinitionSchema } from '../properties/schemas';

export const ShieldBlueprintSchema = z.strictObject({
    entityType: z.literal(CONSTS.ENTITY_TYPE_ITEM).describe('ShieldBlueprint.entityType'),
    properties: z.array(PropertyDefinitionSchema).describe('ShieldBlueprint.properties'),
    weight: z.number().min(0).describe('ShieldBlueprint.weight'),
    itemType: z.literal(CONSTS.ITEM_TYPE_SHIELD).describe('ShieldBlueprint.itemType'),
    armorClass: z.number().int().describe('ShieldBlueprint.armorClass'),
    proficiency: ProficiencySchema.describe('ShieldBlueprint.proficiency'),
    equipmentSlots: z.array(EquipmentSlotSchema).describe('ShieldBlueprint.equipmentSlots'),
}).describe('ShieldBlueprint');

export type ShieldBlueprint = z.infer<typeof ShieldBlueprintSchema>;
