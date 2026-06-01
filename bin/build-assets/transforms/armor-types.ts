/**
 * Transform: armor-types (ArmorBlueprint type templates)
 *
 * Expected CSV columns (header row only, no script row in the sheet):
 *   id, proficiency, armorClass, ac-slashing, ac-piercing, ac-crushing, weight, property, amp, paramName, paramValue
 *
 * - id          : unique ref (e.g. arm-type-leather); triggers a new entity
 * - proficiency : light | medium | heavy → PROFICIENCY_ARMOR_LIGHT/MEDIUM/HEAVY
 * - armorClass  : base AC bonus (integer)
 * - ac-slashing : AC modifier vs slashing damage (integer, can be negative); creates a PropertyArmorClassModifier
 * - ac-piercing : AC modifier vs piercing damage (integer, can be negative)
 * - ac-crushing : AC modifier vs crushing damage (integer, can be negative)
 * - weight      : kg, decimals with dot or comma (e.g. 10 or 1,5)
 * - property    : additional property short name (repeatable on continuation rows)
 * - amp         : amplitude for the last pushed property
 * - paramName   : extra param key (e.g. skill)
 * - paramValue  : extra param value (e.g. SKILL_STEALTH)
 *
 * Note: the old "max-dexterity-bonus" property is a D&D 5e concept with no equivalent
 * in this library — leave that column out of new sheets.
 */

export const HEADERS = [
    'id', 'proficiency', 'armorClass', 'ac-slashing', 'ac-piercing', 'ac-crushing',
    'weight', 'property', 'amp', 'paramName', 'paramValue',
];

export const SCRIPTS = [
    /* id          */ `output(); id(value); c={ entityType: 'ENTITY_TYPE_ITEM', itemType: 'ITEM_TYPE_ARMOR', proficiency: '', armorClass: 0, weight: 0, properties: [], equipmentSlots: ['EQUIPMENT_SLOT_CHEST'] }`,
    /* proficiency */ `c.proficiency = ref(value, 'PROFICIENCY_ARMOR')`,
    /* armorClass  */ `c.armorClass = value`,
    /* ac-slashing */ `c.properties.push({ type: 'PROPERTY_ARMOR_CLASS_MODIFIER', amp: value, damageType: 'DAMAGE_TYPE_SLASHING' })`,
    /* ac-piercing */ `c.properties.push({ type: 'PROPERTY_ARMOR_CLASS_MODIFIER', amp: value, damageType: 'DAMAGE_TYPE_PIERCING' })`,
    /* ac-crushing */ `c.properties.push({ type: 'PROPERTY_ARMOR_CLASS_MODIFIER', amp: value, damageType: 'DAMAGE_TYPE_CRUSHING' })`,
    /* weight      */ `c.weight = parseFloat(value.toString().replace(/,/g, '.'))`,
    /* property    */ `c.properties.push({ type: ref(value, 'property') })`,
    /* amp         */ `last(c.properties).amp = value`,
    /* paramName   */ ``,
    /* paramValue  */ `kv(last(c.properties))`,
];
