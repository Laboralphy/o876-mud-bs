import { z } from 'zod';

/**
 * Cooldown is a special structure that supports several slots of cooldown timers
 * It represent a capability that can be activated a certain number of times.
 * While timers.length < timerMaxCount, you can add a timer in timers array.
 * Each frame time all timers are decreased by 1.
 */

export const CooldownSchema = z.strictObject({
    timers: z.array(z.number().int().positive()), // all timer values (cannot exceed timerMaxCount)
    timerMaxCount: z.number().int().positive(), // maximum number of values
    timerMaxValue: z.number().int(), // maximum value of a timer
    active: z.boolean(),
});

export const CooldownDefinitionSchema = z.strictObject({
    duration: z.number().int(),
    charges: z.number().int(),
});

export type Cooldown = z.infer<typeof CooldownSchema>;
export type CooldownDefinition = z.infer<typeof CooldownDefinitionSchema>;
