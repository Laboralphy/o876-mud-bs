import z from 'zod';
import { CONSTS } from '../consts';
import { EquipmentSlotSchema } from './enums/EquipmentSlot';
import { PropertySchema } from '../properties';

export const GearBlueprintSchema = z.strictObject({
    entityType: z.literal(CONSTS.ENTITY_TYPE_ITEM).describe('fields.entityType'),
    properties: z.array(PropertySchema),
    weight: z.number().min(0).describe('fields.weight'),
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
        .describe('fields.itemType'),
    equipmentSlots: z.array(EquipmentSlotSchema),
});

export type GearBlueprint = z.infer<typeof GearBlueprintSchema>;
