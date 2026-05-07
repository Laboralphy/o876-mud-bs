import { Property } from '../schemas';
import { PropertySchemaAbilityModifier } from '../schemas/ability-modifier';

export class PropertyProgramAbilityModifier<PropertyAbilityModifier> {
    buildProperty(payload: PropertyAbilityModifier): Property {
        return PropertySchemaAbilityModifier.parse(payload);
    }
}
