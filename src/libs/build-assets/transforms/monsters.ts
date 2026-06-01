/**
 * Transform: monsters (CreatureBlueprint)
 *
 * Expected CSV columns (header row only, no script row in the sheet):
 *
 *   id, specie, size, ac,
 *   body, senses, mind, presence,
 *   proficiency,
 *   natw-name, natw-damages, natw-damage-type, natw-attribute, natw-property, natw-amp, natw-paramName, natw-paramValue,
 *   action, action-script, action-cooldown, action-charges, action-range, action-bonus, action-hostile,
 *   traits, def-property, def-amp, def-paramName, def-paramValue, equipment
 *
 * Columns dropped from old D&D format: level, hd, speed, classType, feats,
 *   saving-throw proficiencies, action parameters (handled by action scripts).
 * Use convert-monsters-csv.ts to migrate old CSV data to this format.
 *
 * - id            : unique ref (e.g. c-goblin); triggers a new entity
 * - specie        : beast | humanoid | undead | construct | dragon | ... → SPECIE_xxx
 * - size          : tiny | small | medium | large | huge | gargantuan → CREATURE_SIZE_xxx
 * - ac            : base armor class (integer)
 * - body/senses/mind/presence : library ability scores (integers)
 * - proficiency   : additional proficiency (repeatable on continuation rows)
 *                   simple | complex | unarmed | armor-light | armor-medium | armor-heavy | shield
 * - natw-name     : natural weapon name; adds an inline weapon to equipment
 * - natw-damages  : damage dice for the last pushed natural weapon (e.g. 2d6)
 * - natw-damage-type : damage type short name (slashing | piercing | crushing | thermal | ...)
 * - natw-damage-type : damage type short name (slashing | piercing | crushing | thermal | ...)
 * - natw-attribute: weapon attribute short name (reach | finesse | ...) — repeatable
 * - natw-property : property short name for the last natural weapon — repeatable
 * - natw-amp      : amp for the last pushed natural weapon property
 * - natw-paramName: extra param key for the last natural weapon property
 * - natw-paramValue: extra param value
 * - action        : action id; adds an action
 * - action-script : script id for the last pushed action
 * - action-cooldown: cooldown in turns
 * - action-charges: charges per cooldown
 * - action-range  : effective range
 * - action-bonus  : TRUE | FALSE — is bonus action
 * - action-hostile: TRUE | FALSE — targets enemies
 * - traits        : extended-properties bundle ref (e.g. cp-undead) — repeatable
 * - def-property  : defensive property short name — repeatable
 * - def-amp       : amp for the last pushed defensive property
 * - def-paramName : extra param key for the last defensive property
 * - def-paramValue: extra param value
 * - equipment     : item ref string (e.g. wpn-long-sword) — repeatable
 */

export const HEADERS = [
    'id',
    'specie',
    'size',
    'ac',
    'body',
    'senses',
    'mind',
    'presence',
    'proficiency',
    'natw-name',
    'natw-damages',
    'natw-damageType',
    'natw-altDamageType',
    'natw-attribute',
    'natw-property',
    'natw-amp',
    'natw-paramName',
    'natw-paramValue',
    'action',
    'action-script',
    'action-cooldown',
    'action-charges',
    'action-range',
    'action-bonus',
    'action-hostile',
    'traits',
    'def-property',
    'def-amp',
    'def-paramName',
    'def-paramValue',
    'equipment',
];

export const SCRIPTS = [
    /* id             */ `output(); id(value); c={ entityType: 'ENTITY_TYPE_CREATURE', abilities: {}, armorClass: 0, specie: '', size: 'CREATURE_SIZE_MEDIUM', proficiencies: ['PROFICIENCY_UNARMED'], properties: [], equipment: [], actions: [] }`,
    /* specie         */ `c.specie = ref(value, 'SPECIE')`,
    /* size           */ `c.size = ref(value, 'CREATURE_SIZE')`,
    /* ac             */ `c.armorClass = value`,
    /* body           */ `c.abilities.ABILITY_BODY = value`,
    /* senses         */ `c.abilities.ABILITY_SENSES = value`,
    /* mind           */ `c.abilities.ABILITY_MIND = value`,
    /* presence       */ `c.abilities.ABILITY_PRESENCE = value`,
    /* proficiency    */ `c.proficiencies.push(ref(value, 'PROFICIENCY'))`,
    /* natw-name      */ `c.equipment.push({ entityType: 'ENTITY_TYPE_ITEM', itemType: 'ITEM_TYPE_WEAPON', proficiency: 'PROFICIENCY_UNARMED', weight: 0, size: 'WEAPON_SIZE_SMALL', attributes: [], damages: '1d3', damageType: 'DAMAGE_TYPE_CRUSHING', properties: [], equipmentSlots: ['EQUIPMENT_SLOT_NATURAL_WEAPON_1', 'EQUIPMENT_SLOT_NATURAL_WEAPON_2', 'EQUIPMENT_SLOT_NATURAL_WEAPON_3'] })`,
    /* natw-damages   */ `last(c.equipment).damages = value`,
    /* natw-damageType*/ `last(c.equipment).damageType = ref(value, 'DAMAGE_TYPE')`,
    /* natw-altDamageType*/ `last(c.equipment).altDamageType = ref(value, 'DAMAGE_TYPE')`,
    /* natw-attribute */ `last(c.equipment).attributes.push(ref(value, 'WEAPON_ATTRIBUTE'))`,
    /* natw-property  */ `last(c.equipment).properties.push({ type: ref(value, 'property') })`,
    /* natw-amp       */ `last(last(c.equipment).properties).amp = value`,
    /* natw-paramName */ ``,
    /* natw-paramValue*/ `kv(last(last(c.equipment).properties))`,
    /* action         */ `c.actions.push({ id: value, script: '', bonus: false, hostile: false, range: 30 })`,
    /* action-script  */ `last(c.actions).script = value`,
    /* action-cooldown*/ `last(c.actions).cooldown = value`,
    /* action-charges */ `last(c.actions).charges = value`,
    /* action-range   */ `last(c.actions).range = value`,
    /* action-bonus   */ `last(c.actions).bonus = value === 'TRUE'`,
    /* action-hostile */ `last(c.actions).hostile = value === 'TRUE'`,
    /* traits         */ `if (!c.extends) { c.extends = [] } c.extends.push(value)`,
    /* def-property   */ `c.properties.push({ type: ref(value, 'property') })`,
    /* def-amp        */ `last(c.properties).amp = value`,
    /* def-paramName  */ ``,
    /* def-paramValue */ `kv(last(c.properties))`,
    /* equipment      */ `c.equipment.push(value)`,
];
