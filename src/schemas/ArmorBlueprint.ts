import z from 'zod';
import { CONSTS } from '../consts';
import { EquipmentSlotSchema } from './enums/EquipmentSlot';
import { ProficiencySchema } from './enums/Proficiency';
import { PropertyDefinitionSchema } from '../properties/schemas';

export const ArmorBlueprintSchema = z.strictObject({
    entityType: z.literal(CONSTS.ENTITY_TYPE_ITEM).describe('ArmorBlueprint.entityType'),
    properties: z.array(PropertyDefinitionSchema).describe('ArmorBlueprint.properties'),
    weight: z.number().min(0).describe('ArmorBlueprint.weight'),
    itemType: z.literal(CONSTS.ITEM_TYPE_ARMOR).describe('ArmorBlueprint.itemType'),
    armorClass: z.number().int().describe('ArmorBlueprint.armorClass'),
    proficiency: ProficiencySchema.describe('ArmorBlueprint.proficiency'),
    equipmentSlots: z.array(EquipmentSlotSchema).describe('ArmorBlueprint.equipmentSlots'),
}).describe('ArmorBlueprint');

export type ArmorBlueprint = z.infer<typeof ArmorBlueprintSchema>;
