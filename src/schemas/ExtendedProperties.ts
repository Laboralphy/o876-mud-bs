import { z } from 'zod';
import { PropertyDefinitionSchema } from '../properties/schemas';
import { CONSTS } from '../consts';

export const ExtendedPropertiesSchema = z
    .strictObject({
        entityType: z
            .literal(CONSTS.ENTITY_TYPE_EXTENDED_PROPERTIES)
            .describe('ExtendedProperties.entityType'),
        extends: z.array(z.string()).optional().describe('ExtendedProperties.extends'),
        properties: z.array(PropertyDefinitionSchema).describe('ExtendedProperties.properties'),
    })
    .describe('ExtendedProperties');

export type ExtendedProperties = z.infer<typeof ExtendedPropertiesSchema>;
