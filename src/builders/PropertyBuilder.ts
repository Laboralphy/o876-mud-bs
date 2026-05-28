import { Property, PropertyDefinition, PropertySchema } from '../properties/schemas';
import { generateUniqueId } from '../libs/unique-id';

export class PropertyBuilder {
    static buildProperty(propdef: PropertyDefinition): Property {
        return PropertySchema.parse({
            id: generateUniqueId(),
            type: propdef.type,
            data: propdef,
        });
    }
}
