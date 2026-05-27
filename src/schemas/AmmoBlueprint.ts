import z from 'zod';
import { CONSTS } from '../consts';
import { EquipmentSlotSchema } from './enums/EquipmentSlot';
import { AmmoTypeSchema } from './enums/AmmoType';
import { PropertyDefinitionSchema } from '../properties/schemas';
import { DamageTypeSchema } from './enums/DamageType';

export const AmmoBlueprintSchema = z.strictObject({
    entityType: z.literal(CONSTS.ENTITY_TYPE_ITEM).describe('fields.entityType'),
    properties: z.array(PropertyDefinitionSchema),
    weight: z.number().min(0).describe('fields.weight'),
    itemType: z.literal(CONSTS.ITEM_TYPE_AMMO).describe('fields.itemType'),
    ammoType: AmmoTypeSchema.describe('fields.ammoType'),
    equipmentSlots: z.array(EquipmentSlotSchema),
    damageType: DamageTypeSchema,
    altDamageType: DamageTypeSchema.optional(),
});

export type AmmoBlueprint = z.infer<typeof AmmoBlueprintSchema>;
