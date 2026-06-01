#!/usr/bin/env tsx
/**
 * Generates src/data/schemas.<locale>.json — a single JSON file containing
 * the JSON Schema for every user-facing blueprint and property, with all
 * description keys replaced by their human-readable translations.
 *
 * Usage:
 *   tsx bin/build-schema-descriptions.ts --locale=en
 *   tsx bin/build-schema-descriptions.ts --locale=fr
 */

import { z } from 'zod';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import { WeaponBlueprintSchema } from '../src/schemas/WeaponBlueprint.js';
import { AmmoBlueprintSchema } from '../src/schemas/AmmoBlueprint.js';
import { ArmorBlueprintSchema } from '../src/schemas/ArmorBlueprint.js';
import { ShieldBlueprintSchema } from '../src/schemas/ShieldBlueprint.js';
import { GearBlueprintSchema } from '../src/schemas/GearBlueprint.js';
import { CreatureBlueprintSchema } from '../src/schemas/CreatureBlueprint.js';
import { ActionBlueprintSchema } from '../src/schemas/Action.js';
import { PropertyDefinitionSchema } from '../src/properties/schemas';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const localeArg = process.argv.find((a) => a.startsWith('--locale='));
const locale = localeArg ? localeArg.split('=')[1] : 'en';

const localeFile = join(rootDir, 'src', 'data', 'locales', `${locale}.json`);
const translations: Record<string, string> = JSON.parse(readFileSync(localeFile, 'utf-8'));

function translateDescriptions(node: unknown): unknown {
    if (typeof node !== 'object' || node === null) {
        return node;
    }
    if (Array.isArray(node)) {
        return node.map(translateDescriptions);
    }
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(node as Record<string, unknown>)) {
        if (key === 'description' && typeof value === 'string') {
            result[key] = translations[value] ?? value;
        } else {
            result[key] = translateDescriptions(value);
        }
    }
    return result;
}

const schemas: Record<string, z.ZodTypeAny> = {
    WeaponBlueprint: WeaponBlueprintSchema,
    AmmoBlueprint: AmmoBlueprintSchema,
    ArmorBlueprint: ArmorBlueprintSchema,
    ShieldBlueprint: ShieldBlueprintSchema,
    GearBlueprint: GearBlueprintSchema,
    CreatureBlueprint: CreatureBlueprintSchema,
    ActionBlueprint: ActionBlueprintSchema,
};

// Auto-discover all property schemas from the discriminated union.
// Each variant must have .describe('PropertyXxx') set — that string becomes the key.
for (const schema of PropertyDefinitionSchema.options) {
    const name = (schema as z.ZodTypeAny).description;
    if (name) {
        schemas[name] = schema as z.ZodTypeAny;
    } else {
        console.warn(`Warning: property schema has no .describe() — skipping`);
    }
}

const output: Record<string, unknown> = {};
for (const [name, schema] of Object.entries(schemas)) {
    try {
        const jsonSchema = z.toJSONSchema(schema);
        output[name] = translateDescriptions(jsonSchema);
    } catch (e) {
        console.warn(`Warning: could not generate JSON Schema for ${name}: ${e}`);
    }
}

const outFile = join(rootDir, 'src', 'data', `schemas.${locale}.json`);
writeFileSync(outFile, JSON.stringify(output, null, 2));
console.log(`Written ${outFile}`);
