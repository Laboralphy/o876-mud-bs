import z from 'zod';
import { CONSTS } from '../consts';
import { EquipmentSlotSchema } from './enums/EquipmentSlot';
import { AmmoTypeSchema } from './enums/AmmoType';
import { PropertyDefinitionSchema } from '../properties/schemas';
import { DamageTypeSchema } from './enums/DamageType';

export const AmmoBlueprintSchema = z.strictObject({
    entityType: z.literal(CONSTS.ENTITY_TYPE_ITEM).describe('AmmoBlueprint.entityType'),
    properties: z.array(PropertyDefinitionSchema).describe('AmmoBlueprint.properties'),
    weight: z.number().min(0).describe('AmmoBlueprint.weight'),
    itemType: z.literal(CONSTS.ITEM_TYPE_AMMO).describe('AmmoBlueprint.itemType'),
    ammoType: AmmoTypeSchema.describe('AmmoBlueprint.ammoType'),
    equipmentSlots: z.array(EquipmentSlotSchema).describe('AmmoBlueprint.equipmentSlots'),
    damageType: DamageTypeSchema.describe('AmmoBlueprint.damageType'),
    altDamageType: DamageTypeSchema.optional().describe('AmmoBlueprint.altDamageType'),
}).describe('AmmoBlueprint');

export type AmmoBlueprint = z.infer<typeof AmmoBlueprintSchema>;
