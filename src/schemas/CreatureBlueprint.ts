import { z } from 'zod';
import { EntityTypeSchema } from './enums/EntityType';
import { AbilitySchema } from './enums/Ability';
import { SpecieSchema } from './enums/Specie';
import { PropertyDefinitionSchema } from '../properties/schemas';
import { ItemBlueprintSchema } from './ItemBlueprint';
import { ActionBlueprintSchema } from './Action';
import { CreatureSizeSchema } from './enums/CreatureSize';

export const CreatureBlueprintSchema = z.strictObject({
    ref: z.string().optional(),
    entityType: EntityTypeSchema,
    abilities: z.record(AbilitySchema, z.number().int()),
    armorClass: z.number().int(),
    specie: SpecieSchema,
    size: CreatureSizeSchema,
    properties: z.array(PropertyDefinitionSchema),
    equipment: z.array(ItemBlueprintSchema.or(z.string())),
    actions: z.array(ActionBlueprintSchema),
});

export type CreatureBlueprint = z.infer<typeof CreatureBlueprintSchema>;
