import z from 'zod';
import { PropertySchema } from '../properties/schemas';
import { AmmoBlueprintSchema } from './AmmoBlueprint';
import { WeaponBlueprintSchema } from './WeaponBlueprint';
import { ArmorBlueprintSchema } from './ArmorBlueprint';
import { ShieldBlueprintSchema } from './ShieldBlueprint';
import { GearBlueprintSchema } from './GearBlueprint';

const runtimeFields = {
    id: z.string(),
    properties: z.array(PropertySchema),
};

export const ItemSchema = z.union([
    AmmoBlueprintSchema.omit({ properties: true }).extend(runtimeFields),
    WeaponBlueprintSchema.omit({ properties: true }).extend(runtimeFields),
    ArmorBlueprintSchema.omit({ properties: true }).extend(runtimeFields),
    ShieldBlueprintSchema.omit({ properties: true }).extend(runtimeFields),
    GearBlueprintSchema.omit({ properties: true }).extend(runtimeFields),
]);

export type Item = z.infer<typeof ItemSchema>;
