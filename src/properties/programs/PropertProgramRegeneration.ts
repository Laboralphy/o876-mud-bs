import { Property } from '../schemas';
import { PropertySchemaRegeneration } from '../schemas/regeneration';

export class PropertyProgramRegeneration<PropertyRegeneration> {
    buildProperty(payload: PropertyRegeneration): Property {
        return PropertySchemaRegeneration.parse(payload);
    }
}
