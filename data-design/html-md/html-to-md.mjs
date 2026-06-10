import fs from 'node:fs';
import path from 'node:path';

function extractText(cell) {
    const div = cell.match(/<div[^>]*>(.*?)<\/div>/s);
    if (div) return div[1].trim();
    const inner = cell.match(/<td[^>]*>(.*?)<\/td>/s);
    return inner ? inner[1].replace(/<[^>]+>/g, '').trim() : '';
}

function htmlToMarkdown(html) {
    // strip thead (column letter headers A B C...)
    html = html.replace(/<thead>[\s\S]*?<\/thead>/g, '');

    const rowMatches = [...html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)];
    const rows = rowMatches
        .filter(m => !m[0].includes('freezebar-horizontal-handle') && !m[0].includes('freezebar-vertical-handle'))   // drop freeze bar separator rows
        .map(m => {
            const cells = [...m[1].matchAll(/<td[\s\S]*?<\/td>/g)].map(c => extractText(c[0]));
            return cells;
        })
        .filter(r => r.length > 0);

    if (rows.length === 0) return '';

    const trimRow = r => {
        let last = r.length - 1;
        while (last >= 0 && r[last] === '') last--;
        return r.slice(0, last + 1);
    };

    const trimmed = rows.map(trimRow);
    const maxCols = Math.max(...trimmed.map(r => r.length));
    if (maxCols === 0) return '';

    const pad = r => {
        const out = [...r];
        while (out.length < maxCols) out.push('');
        return out;
    };

    const header = pad(trimmed[0]);
    const sep = header.map(() => '---');
    const dataRows = trimmed.slice(1).filter(r => r.some(c => c !== ''));

    const fmt = row => '| ' + pad(row).map(c => c.replace(/\|/g, '\\|')).join(' | ') + ' |';

    return [fmt(header), '| ' + sep.join(' | ') + ' |', ...dataRows.map(fmt)].join('\n');
}

const inputDir = path.resolve(import.meta.dirname, 'classic');
const outputDir = path.resolve(import.meta.dirname);

for (const file of fs.readdirSync(inputDir).filter(f => f.endsWith('.html'))) {
    const html = fs.readFileSync(path.join(inputDir, file), 'utf8');
    const md = htmlToMarkdown(html);
    const outFile = path.join(outputDir, file.replace('.html', '.md'));
    fs.writeFileSync(outFile, md + '\n');
    console.log(`${file} → ${path.basename(outFile)}`);
}
