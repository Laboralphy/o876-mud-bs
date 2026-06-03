import { Distance } from '../../schemas/enums/Distance';

export enum DISTANCE_RANK {
    CLOSE,
    MEDIUM,
    FAR,
}

export class DistanceComputer {
    static prev(distance: DISTANCE_RANK): DISTANCE_RANK {
        switch (distance) {
            case DISTANCE_RANK.MEDIUM:
            case DISTANCE_RANK.CLOSE: {
                return DISTANCE_RANK.CLOSE;
            }

            case DISTANCE_RANK.FAR: {
                return DISTANCE_RANK.MEDIUM;
            }

            default: {
                throw new RangeError('Invalid distance');
            }
        }
    }

    static succ(distance: DISTANCE_RANK): DISTANCE_RANK {
        switch (distance) {
            case DISTANCE_RANK.FAR:
            case DISTANCE_RANK.MEDIUM: {
                return DISTANCE_RANK.FAR;
            }

            case DISTANCE_RANK.CLOSE: {
                return DISTANCE_RANK.MEDIUM;
            }

            default: {
                throw new RangeError('Invalid distance');
            }
        }
    }

    static rankToDistance(d: DISTANCE_RANK): Distance {
        switch (d) {
            case DISTANCE_RANK.CLOSE: {
                return 'DISTANCE_CLOSE';
            }
            case DISTANCE_RANK.MEDIUM: {
                return 'DISTANCE_MEDIUM';
            }
            case DISTANCE_RANK.FAR: {
                return 'DISTANCE_FAR';
            }
            default: {
                throw new RangeError('Invalid distance rank');
            }
        }
    }

    static distanceToRank(d: Distance): DISTANCE_RANK {
        switch (d) {
            case 'DISTANCE_CLOSE': {
                return DISTANCE_RANK.CLOSE;
            }
            case 'DISTANCE_MEDIUM': {
                return DISTANCE_RANK.MEDIUM;
            }
            case 'DISTANCE_FAR': {
                return DISTANCE_RANK.FAR;
            }
            default: {
                throw new RangeError('Invalid distance');
            }
        }
    }

    /**
     * Compares two distances. Returns a negative number if d1 is closer than d2,
     * zero if equal, and a positive number if d1 is farther than d2.
     */
    static compare(d1: Distance, d2: Distance): number {
        return DistanceComputer.distanceToRank(d1) - DistanceComputer.distanceToRank(d2);
    }
}
