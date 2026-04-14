import z from 'zod';
import { TemporaryPropertySchema } from './TemporaryProperty';
import { ItemBlueprintSchema } from './ItemBlueprint';

export const ItemSchema = ItemBlueprintSchema.and(
    z.object({
        id: z.string(),
        temporaryProperties: z.array(TemporaryPropertySchema),
    })
);

export type Item = z.infer<typeof ItemSchema>;
