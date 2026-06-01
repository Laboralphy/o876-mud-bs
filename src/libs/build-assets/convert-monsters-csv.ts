/**
 * One-shot converter: old D&D monsters CSV → new library format.
 *
 * Usage:
 *   npx tsx bin/build-assets/convert-monsters-csv.ts <input.csv> <output.csv>
 *
 * Changes:
 *   - Drops script row (row 2 in old format)
 *   - Drops: level, hd, speed, classType, action-param-key, action-param-value
 *     (saving-throw proficiency rows are kept as empty — just omit them in the new sheet)
 *   - Adds: size column (empty — fill in Google Sheets)
 *   - Replaces str/dex/con/int/wis/cha (6 cols) with body/senses/mind/presence (4 cols):
 *       body     = round((2×str + con) / 3)
 *       senses   = dex
 *       mind     = round((2×int + wis) / 3)
 *       presence = round((2×cha + wis) / 3)
 *   - Renames: monster→id, proficiencies→proficiency, attributes→natw-attribute,
 *              natw-propParamName→natw-paramName, natw-propParamValue→natw-paramValue,
 *              def-propParamName→def-paramName, def-propParamValue→def-paramValue
 */

import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';
import fs from 'node:fs';

const [, , inputFile, outputFile] = process.argv;
if (!inputFile || !outputFile) {
    console.error('Usage: npx tsx convert-monsters-csv.ts <input.csv> <output.csv>');
    process.exit(1);
}

type Row = string[];

const raw: Row[] = parse(fs.readFileSync(inputFile).toString(), {
    delimiter: ',',
    columns: false,
    skip_empty_lines: false,
    relax_quotes: true,
});

// Old column indices
const O = {
    monster: 0, specie: 1, ac: 2, level: 3, hd: 4, speed: 5,
    str: 6, dex: 7, con: 8, int: 9, wis: 10, cha: 11,
    proficiencies: 12,
    natwName: 13, natwDamages: 14, natwDamageType: 15, natwAttributes: 16,
    natwProperty: 17, natwAmp: 18, natwPropParamName: 19, natwPropParamValue: 20,
    action: 21, actionScript: 22, actionCooldown: 23, actionCharges: 24,
    actionRange: 25, actionBonus: 26, actionHostile: 27,
    actionParamKey: 28, actionParamValue: 29,
    traits: 30, defProperty: 31, defAmp: 32, defPropParamName: 33, defPropParamValue: 34,
    equipment: 35,
};

function toInt(v: string): number {
    const n = parseInt(v, 10);
    return isNaN(n) ? 0 : n;
}

function convertAbilities(row: Row): [string, string, string, string] {
    const str = row[O.str];
    if (str === '') return ['', '', '', ''];
    const s = toInt(str);
    const d = toInt(row[O.dex]);
    const c = toInt(row[O.con]);
    const i = toInt(row[O.int]);
    const w = toInt(row[O.wis]);
    const ch = toInt(row[O.cha]);
    return [
        String(Math.round((2 * s + c) / 3)),  // body
        String(d),                              // senses
        String(Math.round((2 * i + w) / 3)),   // mind
        String(Math.round((2 * ch + w) / 3)),  // presence
    ];
}

const newHeaders: Row = [
    'id', 'specie', 'size', 'ac',
    'body', 'senses', 'mind', 'presence',
    'proficiency',
    'natw-name', 'natw-damages', 'natw-damage-type', 'natw-attribute',
    'natw-property', 'natw-amp', 'natw-paramName', 'natw-paramValue',
    'action', 'action-script', 'action-cooldown', 'action-charges', 'action-range', 'action-bonus', 'action-hostile',
    'traits', 'def-property', 'def-amp', 'def-paramName', 'def-paramValue', 'equipment',
];

// Skip row 0 (old headers) and row 1 (old script row)
const dataRows = raw.slice(2);

const output: Row[] = [newHeaders];

for (const row of dataRows) {
    const [body, senses, mind, presence] = convertAbilities(row);

    // Filter out saving-throw proficiency values (old D&D concept)
    const proficiency = row[O.proficiencies].startsWith('saving-throw') ? '' : row[O.proficiencies];

    output.push([
        row[O.monster],
        row[O.specie],
        '',                         // size — fill in manually
        row[O.ac],
        body, senses, mind, presence,
        proficiency,
        row[O.natwName],
        row[O.natwDamages],
        row[O.natwDamageType],
        row[O.natwAttributes],
        row[O.natwProperty],
        row[O.natwAmp],
        row[O.natwPropParamName],
        row[O.natwPropParamValue],
        row[O.action],
        row[O.actionScript],
        row[O.actionCooldown],
        row[O.actionCharges],
        row[O.actionRange],
        row[O.actionBonus],
        row[O.actionHostile],
        row[O.traits],
        row[O.defProperty],
        row[O.defAmp],
        row[O.defPropParamName],
        row[O.defPropParamValue],
        row[O.equipment],
    ]);
}

fs.writeFileSync(outputFile, stringify(output));
console.log(`Written ${outputFile} (${output.length - 1} data rows)`);
