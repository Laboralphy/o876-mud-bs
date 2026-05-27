import { z } from 'zod';

/**
 * Cooldown is a special structure that supports several slots of cooldown tim.rs
 * When a value is added in then "values" array, it's initialized at maxValue.
 * Each tick, all values are decremented by 1.
 * The maximum item number in the "values" array is limited by "slotCount".
 * when a value reaches zero, it is shifted out from the array.
 * if "active" is false, the cooldown is not ticking and values are not decremented.
 * it must be retriggered manually
 */

export const CooldownSchema = z.strictObject({
    values: z.array(z.number().int().positive()),
    slotCount: z.number().int().positive(), // maximum number of values
    maxValue: z.number().int(),
    active: z.boolean(),
});

export type Cooldown = z.infer<typeof CooldownSchema>;
