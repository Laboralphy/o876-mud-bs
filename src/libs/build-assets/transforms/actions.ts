/**
 * Transform: action blueprints (ActionBlueprint)
 *
 * Expected CSV columns:
 *   id, script, range, hostile, param-name, param-value
 *
 * - id        : unique ref (e.g. act-fire-breath-2d6); triggers a new entity
 * - script    : action script id
 * - range     : distance short name (close | short | medium | long | ...) → DISTANCE_xxx
 * - hostile   : TRUE | FALSE — whether the action targets enemies
 * - param-name: config key (repeatable on continuation rows)
 * - param-value: config value for the last param-name
 */

export const HEADERS = ['id', 'script', 'range', 'hostile', 'param-name', 'param-value'];

export const SCRIPTS = [
    /* id         */ `output(); id(value); c={ script: '', range: 'DISTANCE_MEDIUM', hostile: false, config: {} }`,
    /* script     */ `c.script = value`,
    /* range      */ `c.range = ref(value, 'DISTANCE')`,
    /* hostile    */ `c.hostile = value`,
    /* param-name */ ``,
    /* param-value*/ `kv(c.config)`,
];
