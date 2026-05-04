export const REGEX_XDY = /^\s*([-+]?)\s*(\d+)\s*[Dd]\s*(\d+)\s*(([-+])\s*(\d+))?\s*$/;
const REGEX_NUM = /^([-+]?)\s*(\d+)\s*$/;

export type EvaluatedFormula = { count: number; sides: number; modifier: number };

/**
 * Represents a Dice utility that allows rolling dice with customizable sides and counts,
 * as well as parsing and evaluating dice roll formulas.
 */
export class Dice {
    private readonly cachexdy = new Map<string, EvaluatedFormula>();
    public debug: boolean = false;
    public forceValue: number = -1;

    /**
     * Force a specific value for random() function
     * @param value value between 0 and 1
     */
    cheat(value: number) {
        this.debug = true;
        this.forceValue = Math.max(0, Math.min(1, value));
    }

    /**
     * Disables cheat mode by resetting debug-related properties.
     *
     * This method sets the debug flag to false and resets the forceValue property to -1.
     *
     * @return {void} No return value.
     */
    cheatOff(): void {
        this.debug = false;
        this.forceValue = -1;
    }

    /**
     * random function, return a random floating number between 0 and 1
     */
    random(): number {
        return this.debug ? this.forceValue : Math.random();
    }

    /**
     * Roll a dice
     * @param sides number of sides of the dice
     * @param count number of dice to roll
     */
    private rollDice(sides: number, count: number = 1): number {
        if (count < 0) {
            return -this.rollDice(sides, -count);
        }
        let n = 0;
        for (let i = 0; i < count; i++) {
            n += Math.trunc(this.random() * sides) + 1;
        }
        return n;
    }

    /**
     * Parses a dice formula string and returns an object representing the evaluated formula.
     *
     * @param {string} sFormula - The dice formula to parse (e.g., "2d6+3").
     * @return {EvaluatedFormula} An object containing the parsed values, including the number of dice, the number of sides per die, and the modifier.
     * @throws {Error} If the formula is invalid and does not match the expected pattern.
     */
    parse(sFormula: string): EvaluatedFormula {
        const rxdy = REGEX_XDY.exec(sFormula);
        if (!rxdy) {
            throw new Error(`invalid dice formula: ${sFormula}`);
        }
        const [, sSign, sCount, sSides, , sModifierSign = '+', sModifier = '0'] = rxdy;
        const nSign = sSign === '-' ? -1 : 1;
        const nModifierSign = sModifierSign === '-' ? -1 : 1;
        return {
            count: nSign * Number.parseInt(sCount),
            sides: Number.parseInt(sSides),
            modifier: nModifierSign * Number.parseInt(sModifier),
        };
    }

    /**
     * Roll a dice formula and return the result.
     * @param sFormula - The dice formula to roll (e.g., "2d6+3").
     * @return The result of the dice roll.
     */
    roll(sFormula: string): number {
        const oFormula = this.cachexdy.get(sFormula);
        if (oFormula) {
            return this.rollDice(oFormula.sides, oFormula.count) + oFormula.modifier;
        } else {
            const rnum = REGEX_NUM.exec(sFormula);
            if (rnum) {
                return Number.parseInt(sFormula);
            }
            const oEvaluatedFormula = this.parse(sFormula);
            this.cachexdy.set(sFormula, oEvaluatedFormula);
            return (
                this.rollDice(oEvaluatedFormula.sides, oEvaluatedFormula.count) +
                oEvaluatedFormula.modifier
            );
        }
    }
}
