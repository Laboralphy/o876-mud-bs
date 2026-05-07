import z from 'zod';
import { AbilitySchema } from '../../schemas/enums/Ability';
import { CONSTS } from '../../consts';
import { PropertyProgramAbstract } from '../programs/abstract';

export const PropertySchemaAbilityModifier = z.strictObject({
    type: z.literal(CONSTS.PROPERTY_ABILITY_MODIFIER),
    amp: z.number().int(), // ability modifier
    ability: AbilitySchema, // what ability is modified
});

export type PropertyAbilityModifier = z.infer<typeof PropertySchemaAbilityModifier>;

export class ProgramAbilityModifier extends PropertyProgramAbstract<PropertyAbilityModifier> {
    buildProperty(payload: PropertyAbilityModifier): PropertyAbilityModifier {
        return PropertySchemaAbilityModifier.parse(payload);
    }
}
