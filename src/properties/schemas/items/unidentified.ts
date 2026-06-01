import z from 'zod';
import { CONSTS } from '../../../consts';

/**
 * Makes the item unidentified : its properties are hidden until this property is removed
 */
export const PropertyUnidentified = z.strictObject({
    type: z.literal(CONSTS.PROPERTY_UNIDENTIFIED),
}).describe('PropertyUnidentified');
