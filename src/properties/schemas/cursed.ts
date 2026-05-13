import z from 'zod';
import { CONSTS } from '../../consts';

/**
 * This property is exclusively applied to items and will prevent this item to be unequipped
 * A special "remove curse" effect must be applied to the creature in order to get rid of a cursed item
 */
export const PropertyCursed = z.strictObject({
    type: z.literal(CONSTS.PROPERTY_CURSED),
});
