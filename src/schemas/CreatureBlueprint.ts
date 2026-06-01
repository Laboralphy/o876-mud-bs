import { z } from 'zod';
import { EntityTypeSchema } from './enums/EntityType';
import { AbilitySchema } from './enums/Ability';
import { SpecieSchema } from './enums/Specie';
import { PropertyDefinitionSchema } from '../properties/schemas';
import { ItemBlueprintSchema } from './ItemBlueprint';
import { ActionBlueprintSchema } from './Action';
import { CreatureSizeSchema } from './enums/CreatureSize';
import { CONSTS } from '../consts';

export const CreatureBlueprintSchema = z
    .strictObject({
        ref: z.string().optional().describe('CreatureBlueprint.ref'),
        entityType: z.literal(CONSTS.ENTITY_TYPE_CREATURE).describe('CreatureBlueprint.entityType'),
        abilities: z
            .record(AbilitySchema, z.number().int().positive())
            .describe('CreatureBlueprint.abilities'),
        armorClass: z.number().int().describe('CreatureBlueprint.armorClass'),
        specie: SpecieSchema.describe('CreatureBlueprint.specie'),
        size: CreatureSizeSchema.describe('CreatureBlueprint.size'),
        properties: z.array(PropertyDefinitionSchema).describe('CreatureBlueprint.properties'),
        equipment: z
            .array(ItemBlueprintSchema.or(z.string()))
            .describe('CreatureBlueprint.equipment'),
        actions: z.array(ActionBlueprintSchema).describe('CreatureBlueprint.actions'),
    })
    .describe('CreatureBlueprint');

export type CreatureBlueprint = z.infer<typeof CreatureBlueprintSchema>;
