/**
 * Transform: common-props (ExtendedProperties bundles)
 *
 * Expected CSV columns (header row only, no script row in the sheet):
 *   id, description, extends, property, amp, paramName, paramValue
 *
 * - id          : unique ref for this bundle (e.g. cp-undead); triggers a new entity
 * - description : human-readable comment, ignored in output
 * - extends     : ref to another bundle this one inherits from (can repeat on continuation rows)
 * - property    : property type short name (e.g. immunity, damage-resistance, darkvision)
 * - amp         : amplitude for properties that need it (e.g. damage-modifier)
 * - paramName   : extra param key (e.g. immunityType, damageType)
 * - paramValue  : extra param value (e.g. IMMUNITY_TYPE_PARALYSIS, DAMAGE_TYPE_THERMAL)
 */

export const HEADERS = ['id', 'description', 'extends', 'property', 'amp', 'paramName', 'paramValue'];

export const SCRIPTS = [
    /* id          */ `output(); id(value); c={ entityType: 'ENTITY_TYPE_EXTENDED_PROPERTIES', properties: [] }`,
    /* description */ ``,
    /* extends     */ `if (!c.extends) { c.extends = [] } c.extends.push(value)`,
    /* property    */ `c.properties.push({ type: ref(value, 'property') })`,
    /* amp         */ `last(c.properties).amp = value`,
    /* paramName   */ ``,
    /* paramValue  */ `kv(last(c.properties))`,
];
