import z from 'zod';
import { PropertyTypeSchema } from './enums/PropertyType';

/**
 * This schema define the base structure of a property in order to manager these properties
 */
export const BasePropertySchema = z.object({
    id: z.string(),
    type: PropertyTypeSchema,
    temporary: z.boolean().optional().default(false),
    duration: z.number().int().min(0).optional().default(0),
    tag: z.string().optional().default(''),
});
