export enum DISTANCE {
    CLOSE,
    MEDIUM,
    FAR,
}

export class Distance {
    static prev(distance: DISTANCE): DISTANCE {
        switch (distance) {
            case DISTANCE.MEDIUM:
            case DISTANCE.CLOSE: {
                return DISTANCE.CLOSE;
            }

            case DISTANCE.FAR: {
                return DISTANCE.MEDIUM;
            }

            default: {
                throw new RangeError('Invalid distance');
            }
        }
    }

    static succ(distance: DISTANCE): DISTANCE {
        switch (distance) {
            case DISTANCE.FAR:
            case DISTANCE.MEDIUM: {
                return DISTANCE.FAR;
            }

            case DISTANCE.CLOSE: {
                return DISTANCE.MEDIUM;
            }

            default: {
                throw new RangeError('Invalid distance');
            }
        }
    }

    constructor(protected _distance: DISTANCE) {}

    get value(): DISTANCE {
        return this._distance;
    }

    set value(value: DISTANCE) {
        this._distance = value;
    }

    static from(distance: DISTANCE = DISTANCE.CLOSE): Distance {
        return new Distance(distance);
    }

    inc() {
        this.value = Distance.succ(this.value);
    }

    dec() {
        this.value = Distance.prev(this.value);
    }

    closer(d: DISTANCE) {
        return this.value < d;
    }

    farther(d: DISTANCE) {
        return this.value > d;
    }

    same(d: DISTANCE) {
        return this.value === d;
    }
}
