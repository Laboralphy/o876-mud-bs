import { DiceExpression } from './DiceExpression';
import z from 'zod';

export const AmpExpression = DiceExpression.or(z.number().int());
