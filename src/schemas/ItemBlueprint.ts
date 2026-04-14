import z from 'zod';
import { AmmoBlueprintSchema } from './AmmoBlueprint';
import { WeaponBlueprintSchema } from './WeaponBlueprint';
import { ArmorBlueprintSchema } from './ArmorBlueprint';
import { ShieldBlueprintSchema } from './ShieldBlueprint';
import { GearBlueprintSchema } from './GearBlueprint';

export const ItemBlueprintSchema = z.discriminatedUnion('itemType', [
    AmmoBlueprintSchema,
    WeaponBlueprintSchema,
    ArmorBlueprintSchema,
    ShieldBlueprintSchema,
    GearBlueprintSchema,
]);

export type ItemBlueprint = z.infer<typeof ItemBlueprintSchema>;
