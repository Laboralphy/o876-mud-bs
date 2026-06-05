import { CONSTS } from '../consts';
import z from 'zod';
import { WeaponAttributeSchema } from './enums/WeaponAttribute';
import { ProficiencySchema } from './enums/Proficiency';
import { DamageTypeSchema } from './enums/DamageType';
import { WeaponSizeSchema } from './enums/WeaponSize';
import { AmmoTypeSchema } from './enums/AmmoType';
import { PropertyDefinitionSchema } from '../properties/schemas';
import { DiceExpression } from './DiceExpression';

export const WeaponBlueprintSchema = z.object({
    entityType: z.literal(CONSTS.ENTITY_TYPE_ITEM).describe('WeaponBlueprint.entityType'),
    properties: z.array(PropertyDefinitionSchema).describe('WeaponBlueprint.properties'),
    weight: z.number().min(0).describe('WeaponBlueprint.weight'),
    itemType: z.literal(CONSTS.ITEM_TYPE_WEAPON).describe('WeaponBlueprint.itemType'),
    damages: DiceExpression.describe('WeaponBlueprint.damages'),
    damageType: DamageTypeSchema.describe('WeaponBlueprint.damageType'),
    altDamageType: DamageTypeSchema.optional().describe('WeaponBlueprint.altDamageType'),
    proficiency: ProficiencySchema.describe('WeaponBlueprint.proficiency'),
    attributes: z.array(WeaponAttributeSchema).describe('WeaponBlueprint.attributes'),
    size: WeaponSizeSchema.describe('WeaponBlueprint.size'),
    ammoType: AmmoTypeSchema.optional().describe('WeaponBlueprint.ammoType'),
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
        .describe('WeaponBlueprint.equipmentSlots'),
}).describe('WeaponBlueprint');

export type WeaponBlueprint = z.infer<typeof WeaponBlueprintSchema>;
