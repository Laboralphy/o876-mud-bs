import { z } from 'zod';
import { CONSTS } from '../../../consts';

export const PropertyThink = z.strictObject({
    type: z.literal(CONSTS.PROPERTY_THINK),
    mutate: z.string().optional().describe('PropertyThink.mutate'),
    attack: z.string().optional().describe('PropertyThink.attack'),
    attacked: z.string().optional().describe('PropertyThink.attacked'),
    damage: z.string().optional().describe('PropertyThink.damage'),
    damaged: z.string().optional().describe('PropertyThink.damaged'),
}).describe('PropertyThink');
