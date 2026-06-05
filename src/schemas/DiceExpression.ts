import z from 'zod';
import { REGEX_XDY } from '../libs/dice';

export const DiceExpression = z.number().int().or(z.string().regex(REGEX_XDY));
