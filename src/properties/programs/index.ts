import { CONSTS } from '../../consts';
import { IProgram } from '../../interfaces/IProgram';
import { Property } from '../schemas';
import { PropertyType } from '../../schemas/enums/PropertyType';

import { PropertyProgramRegeneration } from './PropertyProgramRegeneration';
import { PropertyProgramAilment } from './PropertyProgramAilment';

export const propertyPrograms = new Map<PropertyType, IProgram<Property>>([
    [CONSTS.PROPERTY_REGENERATION, new PropertyProgramRegeneration()],
    [CONSTS.PROPERTY_AILMENT, new PropertyProgramAilment()],
]);
