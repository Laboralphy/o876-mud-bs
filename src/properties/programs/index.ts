import { CONSTS } from '../../consts';
import { IProgram } from '../../interfaces/IProgram';
import { Property } from '../schemas';
import { PropertyType } from '../../schemas/enums/PropertyType';

import { PropertyProgramAilment } from './PropertyProgramAilment';
import { PropertyProgramRegeneration } from './PropertyProgramRegeneration';
import { PropertyProgramThink } from './PropertyProgramThink';

export const propertyPrograms = new Map<PropertyType, IProgram<Property>>([
    [CONSTS.PROPERTY_AILMENT, new PropertyProgramAilment()],
    [CONSTS.PROPERTY_REGENERATION, new PropertyProgramRegeneration()],
    [CONSTS.PROPERTY_THINK, new PropertyProgramThink()],
]);
