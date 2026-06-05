import z from 'zod';
import { PropertyTypeSchema } from './enums/PropertyType';

/**
 * This schema define the base structure of a property in order to manage these properties
 */
export const BasePropertySchema = z.object({
    id: z.string(),
    type: PropertyTypeSchema,
    tag: z.string().optional().default(''),
});
