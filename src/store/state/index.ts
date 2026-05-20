import z from 'zod';
import { CONSTS } from '../../consts';
import { PropertySchema } from '../../properties/schemas';
import { EffectSchema } from '../../effects/schemas';
import { EquipmentSchema } from '../../schemas/Equipment';
import { EquipmentSlotSchema } from '../../schemas/enums/EquipmentSlot';

export const StateSchema = z.object({
    abilities: z.object({
        [CONSTS.ABILITY_BODY]: z.number().int().min(0),
        [CONSTS.ABILITY_SENSES]: z.number().int().min(0),
        [CONSTS.ABILITY_MIND]: z.number().int().min(0),
        [CONSTS.ABILITY_PRESENCE]: z.number().int().min(0),
    }),
    properties: z.array(PropertySchema),
    effects: z.array(EffectSchema),
    equipment: EquipmentSchema,
    selectedOffensiveSlot: EquipmentSlotSchema,
    armorClass: z.number().int(), // Natural armor class
});

export type State = z.infer<typeof StateSchema>;
