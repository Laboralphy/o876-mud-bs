import { Property, PropertyDefinition, PropertySchema } from '../properties/schemas';

export class PropertyBuilder {
    static buildProperty(propdef: PropertyDefinition, duration: number | false = false): Property {
        const temporary = duration !== false; // if duration is not false, then it is a int, so the property is temporary
        const d = duration === false ? 0 : duration; // if duration is false, then it is 0, so the property is permanent
        return PropertySchema.parse({
            id: '0',
            type: propdef.type,
            temporary,
            duration: d,
            data: propdef,
        });
    }
}
