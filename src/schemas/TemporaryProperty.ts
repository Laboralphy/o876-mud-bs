import z from 'zod';
import { PropertySchema } from '../properties';

/**
 * This schema define the base structure of a property in order to manage temporary properties
 * applied on items.
 */
export const TemporaryPropertySchema = z.object({
    id: z.string(),
    duration: z.number().int().min(0),
    tag: z.string(),
    property: PropertySchema,
});

export type TemporaryProperty = z.infer<typeof TemporaryPropertySchema>;
