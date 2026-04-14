import { z } from 'zod';
import { CONSTS } from '../../consts';

export const AbilitySchema = z.enum([
    CONSTS.ABILITY_BODY,
    CONSTS.ABILITY_SENSE,
    CONSTS.ABILITY_MIND,
    CONSTS.ABILITY_PRESENCE,
]);

export type Ability = z.infer<typeof AbilitySchema>;
