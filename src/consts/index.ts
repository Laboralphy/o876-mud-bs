import _consts from './index.json';
// All values in index.json equal their key, so this assertion is accurate at runtime
// and tells TypeScript to treat each value as its specific string literal type.
export const CONSTS = _consts as { readonly [K in keyof typeof _consts]: K };
