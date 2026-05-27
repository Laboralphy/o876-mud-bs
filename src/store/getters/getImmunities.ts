import { State } from '../state';
import { GetterReturnType } from '../define-getters';
import { Immunity, ImmunitySchema } from '../../schemas/enums/Immunity';
import { CONSTS } from '../../consts';

const ALL_IMMUNITIES = ImmunitySchema.options as Immunity[];

export function getImmunities(state: State, getters: GetterReturnType): Record<Immunity, boolean> {
    const result = Object.fromEntries(ALL_IMMUNITIES.map((i) => [i, false])) as Record<Immunity, boolean>;
    const allProperties = [...getters.getInnateProperties, ...getters.getEquipmentProperties];
    for (const p of allProperties) {
        if (p.type === CONSTS.PROPERTY_IMMUNITY) {
            result[(p.data as { immunityType: Immunity }).immunityType] = true;
        }
    }
    for (const e of getters.getEffects) {
        if (e.type === CONSTS.EFFECT_IMMUNITY) {
            result[(e.data as { immunityType: Immunity }).immunityType] = true;
        }
    }
    return result;
}
