import { CONSTS } from '../../consts';
import { IProgram } from '../../interfaces/IProgram';
import { Property } from '../schemas';

import { PropertyProgramRegeneration } from './PropertyProgramRegeneration';

export const propertyPrograms = new Map<string, IProgram<Property>>([
    [CONSTS.PROPERTY_REGENERATION, new PropertyProgramRegeneration()],
]);
