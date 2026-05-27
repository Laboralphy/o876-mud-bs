import { CONSTS } from '../../consts';
import { Immunity } from '../../schemas/enums/Immunity';
import { Effect } from '../../effects/schemas';

const EFFECT_TO_IMMUNITY: Partial<Record<string, Immunity>> = {
    [CONSTS.EFFECT_CHARM]: CONSTS.IMMUNITY_TYPE_CHARM,
    [CONSTS.EFFECT_DISEASE]: CONSTS.IMMUNITY_TYPE_DISEASE,
    [CONSTS.EFFECT_FEAR]: CONSTS.IMMUNITY_TYPE_FEAR,
    [CONSTS.EFFECT_PARALYSIS]: CONSTS.IMMUNITY_TYPE_PARALYSIS,
    [CONSTS.EFFECT_PETRIFICATION]: CONSTS.IMMUNITY_TYPE_PETRIFICATION,
    [CONSTS.EFFECT_POISON]: CONSTS.IMMUNITY_TYPE_POISON,
    [CONSTS.EFFECT_ROOT]: CONSTS.IMMUNITY_TYPE_ROOT,
    [CONSTS.EFFECT_STUN]: CONSTS.IMMUNITY_TYPE_STUN,
    [CONSTS.EFFECT_BLINDNESS]: CONSTS.IMMUNITY_TYPE_BLINDNESS,
};

export function getImmunityRules(effect: Effect, immunities: Record<Immunity, boolean>): boolean {
    const immunityType = EFFECT_TO_IMMUNITY[effect.type];
    return immunityType !== undefined && immunities[immunityType];
}
