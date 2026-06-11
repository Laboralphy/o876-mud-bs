/**
 * Usage:
 *   tsx transform-data.ts <csv-file> <dest-path> <transform-file>
 *
 * The transform file must export HEADERS (string[]) and SCRIPTS (string[]).
 * The CSV must have a header row matching HEADERS, then data rows only — no script row.
 */
import { SmartData } from '../smart-data';
import path from 'node:path';
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
import CONSTS from '../../consts/index.json';

async function main(sFileName: string, sDestPath: string, sTransformFile: string): Promise<void> {
    const { HEADERS, SCRIPTS } = await import(pathToFileURL(path.resolve(sTransformFile)).href);
    try {
        const sd = new SmartData({ data: CONSTS });
        const [, ...dataRows] = sd.loadCSV(sFileName); // skip the header row in the CSV
        const oOutput = sd.run([HEADERS, SCRIPTS, ...dataRows]);
        Object.entries(oOutput)
            .filter(([sFile]) => sFile !== '')
            .forEach(([sFile, oStruct]) => {
                const sFileFinal = path.resolve(sDestPath, sFile + '.json');
                fs.writeFileSync(sFileFinal, JSON.stringify(oStruct, null, '  '));
            });
    } catch (e) {
        console.error(e);
        throw new Error(`could not transform data: ${sFileName} - ${(e as Error).message}`);
    }
}

main(process.argv[2], process.argv[3], process.argv[4]);
