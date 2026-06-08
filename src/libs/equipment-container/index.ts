import type { Creature } from '../../Creature';
import { Item } from '../../schemas/Item';
import { EquipmentSlot } from '../../schemas/enums/EquipmentSlot';
import { EquipItemOutcome } from '../../schemas/enums/EquipItemOutcome';
import { CONSTS } from '../../consts';
import { EventCreatureEquipItem } from '../../schemas/events/EventCreatureEquipItem';
import { EventCreatureEquipItemFailed } from '../../schemas/events/EventCreatureEquipItemFailed';
import { EventCreatureRemoveItem } from '../../schemas/events/EventCreatureRemoveItem';
import { EventCreatureRemoveItemFailed } from '../../schemas/events/EventCreatureRemoveItemFailed';

export class EquipmentContainer {
    private readonly creature: Creature;

    constructor(creature: Creature) {
        this.creature = creature;
    }

    private get equipment() {
        return this.creature.state.equipment;
    }

    findEquippedItemSlot(item: Item): EquipmentSlot | undefined {
        const itemId = item.id;
        for (const s in this.equipment) {
            const slot = s as EquipmentSlot;
            const slotItemId = this.equipment[slot]?.id ?? '';
            if (slotItemId === itemId) {
                return slot;
            }
        }
        return undefined;
    }

    unequipItem(item: Item, bypass: boolean = false): EquipItemOutcome {
        const slot = this.findEquippedItemSlot(item);
        if (!slot) {
            this.creature.emit<EventCreatureRemoveItemFailed>(CONSTS.EVENT_CREATURE_REMOVE_ITEM_FAILED, {
                creature: this.creature,
                item,
                reason: CONSTS.EQUIP_ITEM_FAILURE_REASON_NOT_EQUIPPED,
            });
            return CONSTS.EQUIP_ITEM_FAILURE_REASON_NOT_EQUIPPED;
        }
        if (
            !bypass &&
            this.creature.aggregate([CONSTS.PROPERTY_CURSED], { restrictSlots: [slot] }).count > 0
        ) {
            this.creature.emit<EventCreatureRemoveItemFailed>(CONSTS.EVENT_CREATURE_REMOVE_ITEM_FAILED, {
                creature: this.creature,
                item,
                slot,
                reason: CONSTS.EQUIP_ITEM_FAILURE_REASON_CURSED_SLOT,
            });
            return CONSTS.EQUIP_ITEM_FAILURE_REASON_CURSED_SLOT;
        }
        this.equipment[slot] = null;
        this.creature.emit<EventCreatureRemoveItem>(CONSTS.EVENT_CREATURE_REMOVE_ITEM, {
            creature: this.creature,
            item,
            slot,
        });
        return CONSTS.EQUIP_ITEM_SUCCESS;
    }

    private unequipSlot(slot: EquipmentSlot): {
        unequippedItem: Item | null;
        outcome: EquipItemOutcome;
    } {
        const item = this.equipment[slot];
        if (!item) {
            return {
                unequippedItem: null,
                outcome: CONSTS.EQUIP_ITEM_FAILURE_REASON_NOT_EQUIPPED,
            };
        }
        const outcome = this.unequipItem(item);
        return {
            unequippedItem: outcome === CONSTS.EQUIP_ITEM_SUCCESS ? item : null,
            outcome,
        };
    }

    equipItem(item: Item): {
        unequippedItem: Item | null;
        outcome: EquipItemOutcome;
        equippedItem: Item | null;
    } {
        const slots = item.equipmentSlots;
        if (slots.length === 0) {
            this.creature.emit<EventCreatureEquipItemFailed>(CONSTS.EVENT_CREATURE_EQUIP_ITEM_FAILED, {
                creature: this.creature,
                item,
                reason: CONSTS.EQUIP_ITEM_FAILURE_REASON_NO_SUITABLE_SLOT,
            });
            return {
                outcome: CONSTS.EQUIP_ITEM_FAILURE_REASON_NO_SUITABLE_SLOT,
                unequippedItem: null,
                equippedItem: null,
            };
        }
        const availableSlot: EquipmentSlot | undefined = slots.find((slot) => !this.equipment[slot]);
        if (availableSlot) {
            this.equipment[availableSlot] = item;
            this.creature.emit<EventCreatureEquipItem>(CONSTS.EVENT_CREATURE_EQUIP_ITEM, {
                item: this.equipment[availableSlot],
                creature: this.creature,
                slot: availableSlot,
            });
            return {
                unequippedItem: null,
                outcome: CONSTS.EQUIP_ITEM_SUCCESS,
                equippedItem: this.equipment[availableSlot],
            };
        } else {
            let lastOutcome: EquipItemOutcome = CONSTS.EQUIP_ITEM_SUCCESS;
            for (const slot of slots) {
                const eqo = this.unequipSlot(slot);
                if (eqo.outcome === CONSTS.EQUIP_ITEM_SUCCESS) {
                    this.equipment[slot] = item;
                    this.creature.emit<EventCreatureEquipItem>(CONSTS.EVENT_CREATURE_EQUIP_ITEM, {
                        item: this.equipment[slot],
                        creature: this.creature,
                        slot,
                    });
                    return {
                        unequippedItem: eqo.unequippedItem,
                        outcome: CONSTS.EQUIP_ITEM_SUCCESS,
                        equippedItem: this.equipment[slot],
                    };
                } else {
                    lastOutcome = eqo.outcome;
                }
            }
            this.creature.emit<EventCreatureEquipItemFailed>(CONSTS.EVENT_CREATURE_EQUIP_ITEM_FAILED, {
                creature: this.creature,
                item,
                reason: lastOutcome,
            });
            return {
                outcome: lastOutcome,
                unequippedItem: null,
                equippedItem: null,
            };
        }
    }
}
