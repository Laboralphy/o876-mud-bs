/**
 * Shared transform for item instances (weapons, armors, shields, ammo, gear).
 *
 * Expected CSV columns (header row only, no script row in the sheet):
 *   id, type, property, amp, paramName, paramValue
 *
 * - id       : unique ref (e.g. wpn-long-sword); triggers a new entity
 * - type     : ref to the type template this item extends (e.g. wpn-type-long-sword)
 * - property : optional property short name (repeatable on continuation rows)
 * - amp      : amplitude for the last pushed property
 * - paramName: extra param key (e.g. damageType, skill)
 * - paramValue: extra param value
 */

export const HEADERS = ['id', 'type', 'property', 'amp', 'paramName', 'paramValue'];

export const SCRIPTS = [
    /* id        */ `output(); id(value); c={ entityType: 'ENTITY_TYPE_ITEM', extends: [], properties: [] }`,
    /* type      */ `c.extends.push(value)`,
    /* property  */ `c.properties.push({ type: ref(value, 'property') })`,
    /* amp       */ `last(c.properties).amp = value`,
    /* paramName */ ``,
    /* paramValue*/ `kv(last(c.properties))`,
];
