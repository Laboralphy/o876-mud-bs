import z from 'zod';
import { REGEX_XDY } from '../libs/dice';

export const DiceExpression = z.string().regex(REGEX_XDY);
