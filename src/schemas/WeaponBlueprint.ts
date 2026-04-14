import { CONSTS } from '../consts';
import z from 'zod';
import { WeaponAttributeSchema } from './enums/WeaponAttribute';
import { ProficiencySchema } from './enums/Proficiency';
import { DamageTypeSchema } from './enums/DamageType';
import { WeaponSizeSchema } from './enums/WeaponSize';
import { AmmoTypeSchema } from './enums/AmmoType';
import { PropertySchema } from '../properties';

export const WeaponBlueprintSchema = z.object({
    entityType: z.literal(CONSTS.ENTITY_TYPE_ITEM).describe('fields.entityType'),
    properties: z.array(PropertySchema),
    weight: z.number().min(0).describe('fields.weight'),
    itemType: z.literal(CONSTS.ITEM_TYPE_WEAPON).describe('fields.itemType'),
    damages: z.string().describe('fields.damages'),
    damageType: DamageTypeSchema.describe('fields.damageType'),
    proficiency: ProficiencySchema.describe('fields.proficiency'),
    attributes: z.array(WeaponAttributeSchema).describe('fields.weaponAttributes'),
    size: WeaponSizeSchema.describe('fields.size'),
    ammoType: AmmoTypeSchema.optional().describe('fields.ammoType'),
    equipmentSlots: z
        .array(
            z.union([
                z.literal(CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE),
                z.literal(CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED),
                z.literal(CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_1),
                z.literal(CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_2),
                z.literal(CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_3),
            ])
        )
        .describe('fields.equipmentSlots'),
});

export type WeaponBlueprint = z.infer<typeof WeaponBlueprintSchema>;
