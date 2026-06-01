import z from 'zod';
import { CONSTS } from '../../consts';

export const AilmentTypeSchema = z
    .enum([
        CONSTS.AILMENT_ABILITY_DRAIN,
        CONSTS.AILMENT_ATTACK_DRAIN,
        CONSTS.AILMENT_ARMOR_CLASS_DRAIN,
        CONSTS.AILMENT_DISEASE,
        CONSTS.AILMENT_BLINDNESS,
        CONSTS.AILMENT_FEAR,
        CONSTS.AILMENT_POISON,
        CONSTS.AILMENT_PARALYSIS,
        CONSTS.AILMENT_PETRIFICATION,
        CONSTS.AILMENT_STUN,
        CONSTS.AILMENT_ROOT,
    ])
    .describe('fields.ailmentType');

export type AilmentType = z.infer<typeof AilmentTypeSchema>;
