import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Creature } from '../../src/Creature';
import { LocationRegistry } from '../../src/libs/locations/LocationRegistry';
import { CONSTS } from '../../src/consts';
import { Dice } from '../../src/libs/dice';
import { makeAbilityModifierEffect } from '../helpers/helpers';

// For stealth tests: mock so the stealthy creature always wins the skill contest
// (first roll = observer's stealth check, second = target's perception check)
function mockStealthWins() {
    vi.spyOn(Dice.prototype, 'roll').mockReturnValueOnce(15).mockReturnValueOnce(5);
}

function pushEffect(creature: Creature, type: string) {
    creature.state.effects.push(
        makeAbilityModifierEffect({ type } as Parameters<typeof makeAbilityModifierEffect>[0])
    );
}

describe('getCreatureVisibility', () => {
    let registry: LocationRegistry;
    let observer: Creature;
    let target: Creature;

    beforeEach(() => {
        registry = new LocationRegistry();
        observer = new Creature('observer');
        target = new Creature('target');
        // plain room, no special environments
        const room = registry.defineLocation('room');
        room.addCreature(observer);
        room.addCreature(target);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('returns VISIBLE when target is self', () => {
        expect(observer.getCreatureVisibility(observer)).toBe(CONSTS.CREATURE_VISIBILITY_VISIBLE);
    });

    it('returns VISIBLE in a normal lit room', () => {
        expect(observer.getCreatureVisibility(target)).toBe(CONSTS.CREATURE_VISIBILITY_VISIBLE);
    });

    // ── Blindness / fog ────────────────────────────────────────────────────────

    it('returns BLINDED when observer has EFFECT_BLINDNESS', () => {
        pushEffect(observer, CONSTS.EFFECT_BLINDNESS);
        expect(observer.getCreatureVisibility(target)).toBe(CONSTS.CREATURE_VISIBILITY_BLINDED);
    });

    it('returns BLINDED when observer is in a fog location', () => {
        const fogRoom = registry.defineLocation('fog-room', [CONSTS.ENVIRONMENT_FOG]);
        registry.moveCreature(observer, 'fog-room');
        registry.moveCreature(target, 'fog-room');
        expect(observer.getCreatureVisibility(target)).toBe(CONSTS.CREATURE_VISIBILITY_BLINDED);
    });

    it('fog on the target location does not blind the observer', () => {
        // fog only matters on the observer's own location
        const plainRoom = registry.defineLocation('plain');
        const fogRoom = registry.defineLocation('fog-room', [CONSTS.ENVIRONMENT_FOG]);
        registry.moveCreature(observer, 'plain');
        registry.moveCreature(target, 'fog-room');
        expect(observer.getCreatureVisibility(target)).toBe(CONSTS.CREATURE_VISIBILITY_VISIBLE);
    });

    // ── Invisibility ───────────────────────────────────────────────────────────

    it('returns INVISIBLE when target has EFFECT_INVISIBILITY', () => {
        pushEffect(target, CONSTS.EFFECT_INVISIBILITY);
        expect(observer.getCreatureVisibility(target)).toBe(CONSTS.CREATURE_VISIBILITY_INVISIBLE);
    });

    it('returns VISIBLE when target is invisible but observer has EFFECT_SEE_INVISIBILITY', () => {
        pushEffect(target, CONSTS.EFFECT_INVISIBILITY);
        pushEffect(observer, CONSTS.EFFECT_SEE_INVISIBILITY);
        expect(observer.getCreatureVisibility(target)).toBe(CONSTS.CREATURE_VISIBILITY_VISIBLE);
    });

    it('SEE_INVISIBILITY alone (target not invisible) does not change outcome', () => {
        pushEffect(observer, CONSTS.EFFECT_SEE_INVISIBILITY);
        expect(observer.getCreatureVisibility(target)).toBe(CONSTS.CREATURE_VISIBILITY_VISIBLE);
    });

    // ── Stealth ────────────────────────────────────────────────────────────────

    it('returns HIDDEN when target has EFFECT_STEALTH', () => {
        mockStealthWins();
        pushEffect(target, CONSTS.EFFECT_STEALTH);
        expect(observer.getCreatureVisibility(target)).toBe(CONSTS.CREATURE_VISIBILITY_HIDDEN);
    });

    it('stealth on target still hides when observer has SEE_INVISIBILITY (no invisibility involved)', () => {
        mockStealthWins();
        pushEffect(target, CONSTS.EFFECT_STEALTH);
        pushEffect(observer, CONSTS.EFFECT_SEE_INVISIBILITY);
        expect(observer.getCreatureVisibility(target)).toBe(CONSTS.CREATURE_VISIBILITY_HIDDEN);
    });

    // ── Darkness ───────────────────────────────────────────────────────────────

    it('returns DARKNESS in a dark room with no light source', () => {
        const darkRoom = registry.defineLocation('dark-room', [CONSTS.ENVIRONMENT_DARKNESS]);
        registry.moveCreature(observer, 'dark-room');
        registry.moveCreature(target, 'dark-room');
        expect(observer.getCreatureVisibility(target)).toBe(CONSTS.CREATURE_VISIBILITY_DARKNESS);
    });

    it('returns VISIBLE in a dark room when observer has PROPERTY_LIGHT', () => {
        const darkRoom = registry.defineLocation('dark-room', [CONSTS.ENVIRONMENT_DARKNESS]);
        registry.moveCreature(observer, 'dark-room');
        registry.moveCreature(target, 'dark-room');
        observer.state.properties.push({ type: CONSTS.PROPERTY_LIGHT });
        expect(observer.getCreatureVisibility(target)).toBe(CONSTS.CREATURE_VISIBILITY_VISIBLE);
    });

    it('returns DARKNESS when observer has no location', () => {
        const wanderer = new Creature('wanderer');
        const other = new Creature('other');
        expect(wanderer.getCreatureVisibility(other)).toBe(CONSTS.CREATURE_VISIBILITY_DARKNESS);
    });

    // ── Priority ordering ──────────────────────────────────────────────────────

    it('BLINDNESS takes priority over target INVISIBILITY', () => {
        pushEffect(observer, CONSTS.EFFECT_BLINDNESS);
        pushEffect(target, CONSTS.EFFECT_INVISIBILITY);
        expect(observer.getCreatureVisibility(target)).toBe(CONSTS.CREATURE_VISIBILITY_BLINDED);
    });

    it('BLINDNESS takes priority over target STEALTH', () => {
        pushEffect(observer, CONSTS.EFFECT_BLINDNESS);
        pushEffect(target, CONSTS.EFFECT_STEALTH);
        expect(observer.getCreatureVisibility(target)).toBe(CONSTS.CREATURE_VISIBILITY_BLINDED);
    });

    it('FOG takes priority over target INVISIBILITY', () => {
        const fogRoom = registry.defineLocation('fog-room', [CONSTS.ENVIRONMENT_FOG]);
        registry.moveCreature(observer, 'fog-room');
        registry.moveCreature(target, 'fog-room');
        pushEffect(target, CONSTS.EFFECT_INVISIBILITY);
        expect(observer.getCreatureVisibility(target)).toBe(CONSTS.CREATURE_VISIBILITY_BLINDED);
    });

    it('INVISIBILITY takes priority over STEALTH', () => {
        pushEffect(target, CONSTS.EFFECT_INVISIBILITY);
        pushEffect(target, CONSTS.EFFECT_STEALTH);
        expect(observer.getCreatureVisibility(target)).toBe(CONSTS.CREATURE_VISIBILITY_INVISIBLE);
    });

    it('SEE_INVISIBILITY lets STEALTH through when target has both effects', () => {
        mockStealthWins();
        pushEffect(target, CONSTS.EFFECT_INVISIBILITY);
        pushEffect(target, CONSTS.EFFECT_STEALTH);
        pushEffect(observer, CONSTS.EFFECT_SEE_INVISIBILITY);
        expect(observer.getCreatureVisibility(target)).toBe(CONSTS.CREATURE_VISIBILITY_HIDDEN);
    });
});
