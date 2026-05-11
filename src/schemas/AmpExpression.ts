import { DiceExpression } from './DiceExpression';
import z from 'zod';

export const AmpExpressionSchema = DiceExpression.or(z.number().int());

export type AmpExpression = z.infer<typeof AmpExpressionSchema>;
