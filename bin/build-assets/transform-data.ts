import { SmartData } from '../../src/libs/smart-data';
import path from 'node:path';
import fs from 'node:fs';
import CONSTS from '../../src/consts/index.json';

function main(sFileName: string, sDestPath: string): void {
    try {
        const sd = new SmartData({ data: CONSTS });
        const aRows = sd.loadCSV(sFileName);
        const oOutput = sd.run(aRows);
        Object.entries(oOutput)
            .filter(([sFile]) => sFile !== '')
            .forEach(([sFile, oStruct]) => {
                const sFileFinal = path.resolve(sDestPath, sFile + '.json');
                fs.writeFileSync(sFileFinal, JSON.stringify(oStruct, null, '  '));
            });
    } catch (e) {
        throw new Error(`could not transform data: ${sFileName} - ${(e as Error).message}`);
    }
}

main(process.argv[2], process.argv[3]);
