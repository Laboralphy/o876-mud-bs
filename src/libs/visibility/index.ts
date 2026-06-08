import type { Creature } from '../../Creature';
import { CreatureVisibility } from '../../schemas/enums/CreatureVisibility';
import { CONSTS } from '../../consts';

export function isWieldingLight(creature: Creature): boolean {
    const mg = creature.getters;
    return mg.getEffectSet.has(CONSTS.EFFECT_LIGHT) || mg.getPropertySet.has(CONSTS.PROPERTY_LIGHT);
}

export function hasDarkvision(creature: Creature): boolean {
    const mg = creature.getters;
    return (
        mg.getEffectSet.has(CONSTS.EFFECT_DARKVISION) ||
        mg.getPropertySet.has(CONSTS.PROPERTY_DARKVISION)
    );
}

export function isInBrightLocation(creature: Creature): boolean {
    const location = creature.location;
    if (!location) {
        return false;
    }
    if (location.environments.has(CONSTS.ENVIRONMENT_FOG)) {
        return false;
    }
    if (location.environments.has(CONSTS.ENVIRONMENT_DARKNESS)) {
        for (const c of location.creatures) {
            if (isWieldingLight(c)) {
                return true;
            }
        }
        return false;
    }
    return true;
}

export function getCreatureVisibility(creature: Creature, oTarget: Creature): CreatureVisibility {
    if (oTarget === creature) {
        return CONSTS.CREATURE_VISIBILITY_VISIBLE;
    }
    const mg = creature.getters;
    const tg = oTarget.getters;
    const myEffects = mg.getEffectSet;
    const targetEffects = tg.getEffectSet;
    const bFog = creature.location?.environments.has(CONSTS.ENVIRONMENT_FOG) ?? false;

    if (myEffects.has(CONSTS.EFFECT_BLINDNESS) || bFog) {
        return CONSTS.CREATURE_VISIBILITY_BLINDED;
    }
    if (
        targetEffects.has(CONSTS.EFFECT_INVISIBILITY) &&
        !myEffects.has(CONSTS.EFFECT_SEE_INVISIBILITY)
    ) {
        return CONSTS.CREATURE_VISIBILITY_INVISIBLE;
    }
    if (targetEffects.has(CONSTS.EFFECT_STEALTH)) {
        return CONSTS.CREATURE_VISIBILITY_HIDDEN;
    }
    if (isInBrightLocation(creature)) {
        return CONSTS.CREATURE_VISIBILITY_VISIBLE;
    }
    if (creature.location?.environments.has(CONSTS.ENVIRONMENT_DARKNESS) && hasDarkvision(creature)) {
        return CONSTS.CREATURE_VISIBILITY_VISIBLE;
    }
    return CONSTS.CREATURE_VISIBILITY_DARKNESS;
}
