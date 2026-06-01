import vm from 'node:vm';
import { parse } from 'csv-parse/sync';
import fs from 'node:fs';

type Row = string[];

interface SmartDataContext {
    c: Record<string, unknown>;
    _id: string;
    value: unknown;
    leftValue: unknown;
    _output: Record<string, unknown>;
    ref: (s: string, r?: string) => unknown;
    kv: (obj: Record<string, unknown>) => void;
    output: () => void;
    last: <T>(arr: T[]) => T | undefined;
    id: (s: string) => void;
}

export class SmartData {
    private _data: Record<string, unknown>;

    constructor({ data = {} }: { data?: Record<string, unknown> } = {}) {
        this._data = data;
    }

    private _bool(v: unknown): unknown {
        return v === 'FALSE' ? false : v === 'TRUE' ? true : v;
    }

    loadCSV(sFile: string): Row[] {
        return parse(fs.readFileSync(sFile).toString(), {
            delimiter: ',',
            columns: false,
            skip_empty_lines: true,
        }) as Row[];
    }

    toSNAKECASE(s: string): string {
        return s.replace(/-/g, '_').toUpperCase();
    }

    searchConst(sSearch: unknown, sRadix = ''): unknown {
        const CONSTS = this._data;
        if (typeof sSearch === 'string' && sSearch.toUpperCase() === 'TRUE') {
            return true;
        }
        if (typeof sSearch === 'string' && sSearch.toUpperCase() === 'FALSE') {
            return false;
        }
        if (typeof sSearch === 'number' || typeof sSearch === 'boolean') {
            return sSearch;
        }
        if (Array.isArray(sSearch)) {
            return sSearch.map((s) => this.searchConst(s, sRadix));
        }
        if (typeof sSearch !== 'string') {
            return sSearch;
        }

        let sSearchUpper = this.toSNAKECASE(sSearch);

        const fSearch = (s: unknown): boolean => {
            if (typeof s !== 'string') {
                throw new TypeError(`Expected a string, got ${typeof s}`);
            }
            if (sRadix !== '' && !s.startsWith(sRadix.toUpperCase())) {
                return false;
            }
            return s.endsWith(sSearchUpper);
        };

        const ff = (a: unknown[]): string | undefined =>
            (a.filter(fSearch) as string[]).sort((a, b) => a.length - b.length).find(fSearch);

        let sFound = ff(Object.values(CONSTS));
        if (sFound) {
            return sFound;
        }

        sSearchUpper = '_' + this.toSNAKECASE(sSearch);
        sFound = ff(Object.values(CONSTS));
        return sFound === undefined ? sSearch : sFound;
    }

    compile(oCodes: Record<string, string>): (vm.Script | null)[] {
        return Object.values(oCodes).map((sCode) => (sCode ? new vm.Script(sCode) : null));
    }

    createContext(): SmartDataContext {
        const oContext: SmartDataContext = {
            c: {},
            _id: '',
            value: '',
            leftValue: '',
            _output: {},
            ref: (s, r) => this.searchConst(s, r),
            kv(obj) {
                if (!obj) {
                    throw new Error('kv: no object provided');
                }
                if (typeof oContext.value === 'number' || typeof oContext.value === 'boolean') {
                    obj[oContext.leftValue as string] = oContext.value;
                    return;
                }
                const sTrimmedValue = (oContext.value as string).trim();
                const c0 = sTrimmedValue.charAt(0);
                obj[oContext.leftValue as string] = '[{"\''.includes(c0)
                    ? JSON.parse(sTrimmedValue)
                    : sTrimmedValue;
            },
            output() {
                if (oContext.c) {
                    oContext._output[oContext._id] = oContext.c;
                }
                oContext.c = {};
            },
            last<T>(arr: T[]): T | undefined {
                return arr.length > 0 ? arr[arr.length - 1] : undefined;
            },
            id(s) {
                oContext._id = s;
            },
        };
        return vm.createContext(oContext) as SmartDataContext;
    }

    runRow(
        aRow: Row,
        aScripts: (vm.Script | null)[],
        oContext: SmartDataContext,
        aSourceScripts: string[]
    ): void {
        aRow.forEach((value, i) => {
            if (value !== '') {
                const parsed: unknown = isNaN(+value) ? value : parseFloat(value);
                oContext.value = this._bool(parsed);
                try {
                    aScripts[i]?.runInContext(oContext as unknown as vm.Context);
                } catch (e) {
                    console.error(e);
                    console.error(aRow, i, aRow[i], aSourceScripts[i]);
                    console.error('COLUMN ' + i + ' : ' + value);
                    throw e;
                } finally {
                    oContext.leftValue = oContext.value;
                }
            }
        });
    }

    run(aRows: Row[]): Record<string, unknown> {
        const [aHeader, aScripts, ...aData] = aRows;
        if (!aHeader) {
            throw new Error('no header defined');
        }
        const oScripts = aHeader.reduce<Record<string, string>>((prev, curr, i) => {
            prev[curr] = aScripts[i] ?? '';
            return prev;
        }, {});
        const aCompiledScripts = this.compile(oScripts);
        const oContext = this.createContext();
        aData.forEach((row) => {
            this.runRow(row, aCompiledScripts, oContext, aScripts);
        });
        oContext.output();
        return oContext._output;
    }
}
