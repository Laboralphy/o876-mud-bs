import { Dice } from './libs/dice';

/**
 * Represents a single dice roll session, handling formulas, modifiers,
 */
export class DiceRoll {
    readonly #roll: number = 0;
    readonly #dice = new Dice();
    readonly #formula: string = '1d20';
    #modifier: number = 0;

    constructor(formula: string) {
        this.#formula = formula;
        this.#roll = this.doRoll();
    }

    /**
     * Executes a dice roll based on the current formula.
     * @returns {number} The result of the dice roll.
     */
    doRoll(): number {
        return this.#dice.roll(this.#formula);
    }

    /**
     * Gets the roll result taking advantage and disadvantage into account.
     * - If both or neither are active, returns the primary roll.
     * - If only advantage is active, returns the best of two rolls.
     * - If only disadvantage is active, returns the worst of two rolls.
     * @returns {number} The effective roll result.
     */
    get roll(): number {
        return this.#roll;
    }

    /**
     * Gets the static modifier applied to the roll result.
     * @returns {number} The modifier value.
     */
    get modifier(): number {
        return this.#modifier;
    }

    /**
     * Sets the static modifier to be applied to the roll result.
     * @param {number} value - The modifier value.
     */
    set modifier(value: number) {
        this.#modifier = value;
    }

    /**
     * Gets the total result of the roll including the modifier.
     * @returns {number} The total sum (roll + modifier).
     */
    get total(): number {
        return this.roll + this.#modifier;
    }
}
