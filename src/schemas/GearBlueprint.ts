import z from 'zod';
import { CONSTS } from '../consts';
import { EquipmentSlotSchema } from './enums/EquipmentSlot';
import { PropertyDefinitionSchema } from '../properties/schemas';

export const GearBlueprintSchema = z.strictObject({
    entityType: z.literal(CONSTS.ENTITY_TYPE_ITEM).describe('GearBlueprint.entityType'),
    properties: z.array(PropertyDefinitionSchema).describe('GearBlueprint.properties'),
    weight: z.number().min(0).describe('GearBlueprint.weight'),
    itemType: z
        .union([
            z.literal(CONSTS.ITEM_TYPE_BELT),
            z.literal(CONSTS.ITEM_TYPE_BOOTS),
            z.literal(CONSTS.ITEM_TYPE_GLOVES),
            z.literal(CONSTS.ITEM_TYPE_HELM),
            z.literal(CONSTS.ITEM_TYPE_BRACERS),
            z.literal(CONSTS.ITEM_TYPE_CLOAK),
            z.literal(CONSTS.ITEM_TYPE_GAUNTLETS),
            z.literal(CONSTS.ITEM_TYPE_HAT),
            z.literal(CONSTS.ITEM_TYPE_RING),
            z.literal(CONSTS.ITEM_TYPE_NECKLACE),
            z.literal(CONSTS.ITEM_TYPE_TORCH),
        ])
        .describe('GearBlueprint.itemType'),
    equipmentSlots: z.array(EquipmentSlotSchema).describe('GearBlueprint.equipmentSlots'),
}).describe('GearBlueprint');

export type GearBlueprint = z.infer<typeof GearBlueprintSchema>;
