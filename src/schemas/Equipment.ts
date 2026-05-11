import z from 'zod';
import { CONSTS } from '../consts';
import { ItemSchema } from './Item';

export const EquipmentSchema = z.strictObject({
    [CONSTS.EQUIPMENT_SLOT_HEAD]: ItemSchema.nullable(),
    [CONSTS.EQUIPMENT_SLOT_NECK]: ItemSchema.nullable(),
    [CONSTS.EQUIPMENT_SLOT_BACK]: ItemSchema.nullable(),
    [CONSTS.EQUIPMENT_SLOT_CHEST]: ItemSchema.nullable(),
    [CONSTS.EQUIPMENT_SLOT_ARMS]: ItemSchema.nullable(),
    [CONSTS.EQUIPMENT_SLOT_FINGER_LEFT]: ItemSchema.nullable(),
    [CONSTS.EQUIPMENT_SLOT_FINGER_RIGHT]: ItemSchema.nullable(),
    [CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE]: ItemSchema.nullable(),
    [CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED]: ItemSchema.nullable(),
    [CONSTS.EQUIPMENT_SLOT_AMMO]: ItemSchema.nullable(),
    [CONSTS.EQUIPMENT_SLOT_SHIELD]: ItemSchema.nullable(),
    [CONSTS.EQUIPMENT_SLOT_WAIST]: ItemSchema.nullable(),
    [CONSTS.EQUIPMENT_SLOT_FEET]: ItemSchema.nullable(),
    [CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_1]: ItemSchema.nullable(),
    [CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_2]: ItemSchema.nullable(),
    [CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_3]: ItemSchema.nullable(),
});

export type Equipment = z.infer<typeof EquipmentSchema>;
