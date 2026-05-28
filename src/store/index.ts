import { State, StateSchema } from './state';
import { GetterReturnFunctions, Getters } from './define-getters';
import { CONSTS } from '../consts';
import { ReactiveStore } from '@laboralphy/reactor';

export function buildStore(): ReactiveStore<State, GetterReturnFunctions> {
    const state: State = StateSchema.parse({
        abilities: {
            [CONSTS.ABILITY_BODY]: 10,
            [CONSTS.ABILITY_SENSES]: 10,
            [CONSTS.ABILITY_MIND]: 10,
            [CONSTS.ABILITY_PRESENCE]: 10,
        },
        properties: [],
        effects: [],
        equipment: {
            [CONSTS.EQUIPMENT_SLOT_HEAD]: null,
            [CONSTS.EQUIPMENT_SLOT_NECK]: null,
            [CONSTS.EQUIPMENT_SLOT_BACK]: null,
            [CONSTS.EQUIPMENT_SLOT_CHEST]: null,
            [CONSTS.EQUIPMENT_SLOT_ARMS]: null,
            [CONSTS.EQUIPMENT_SLOT_FINGER_LEFT]: null,
            [CONSTS.EQUIPMENT_SLOT_FINGER_RIGHT]: null,
            [CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE]: null,
            [CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED]: null,
            [CONSTS.EQUIPMENT_SLOT_AMMO]: null,
            [CONSTS.EQUIPMENT_SLOT_SHIELD]: null,
            [CONSTS.EQUIPMENT_SLOT_WAIST]: null,
            [CONSTS.EQUIPMENT_SLOT_FEET]: null,
            [CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_1]: null,
            [CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_2]: null,
            [CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_3]: null,
        },
        selectedOffensiveSlot: CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE,
        armorClass: 0,
        specie: CONSTS.SPECIE_HUMANOID,
        size: CONSTS.CREATURE_SIZE_MEDIUM,
        actions: {},
    });
    return new ReactiveStore(state, Getters);
}
