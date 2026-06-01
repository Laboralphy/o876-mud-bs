import { beforeEach, describe, expect, it } from 'vitest';
import { ExtendResolver } from '../../src/libs/extend-resolver';

describe('ExtendResolver', () => {
    let er: ExtendResolver;

    beforeEach(() => {
        er = new ExtendResolver();
    });

    // ─── declareEntity / keys ─────────────────────────────────────────────────

    describe('keys', () => {
        it('is empty before any declaration', () => {
            expect(er.keys).toEqual([]);
        });

        it('lists each declared ref', () => {
            er.declareEntity('a', { entityType: 'ENTITY_TYPE_CREATURE' });
            er.declareEntity('b', { entityType: 'ENTITY_TYPE_ITEM' });
            expect(er.keys).toContain('a');
            expect(er.keys).toContain('b');
            expect(er.keys).toHaveLength(2);
        });

        it('overwrites a ref declared twice', () => {
            er.declareEntity('a', { entityType: 'ENTITY_TYPE_CREATURE', v: 1 });
            er.declareEntity('a', { entityType: 'ENTITY_TYPE_CREATURE', v: 2 });
            expect(er.keys).toHaveLength(1);
        });
    });

    // ─── getEntityType ────────────────────────────────────────────────────────

    describe('getEntityType', () => {
        it('returns the entityType of a declared entity', () => {
            er.declareEntity('hero', { entityType: 'ENTITY_TYPE_CREATURE' });
            expect(er.getEntityType('hero')).toBe('ENTITY_TYPE_CREATURE');
        });

        it('throws ReferenceError for an unknown ref', () => {
            expect(() => er.getEntityType('ghost')).toThrow(ReferenceError);
        });
    });

    // ─── resolveEntity — basic ────────────────────────────────────────────────

    describe('resolveEntity — basic', () => {
        it('throws ReferenceError for an unknown ref', () => {
            expect(() => er.resolveEntity('ghost')).toThrow(ReferenceError);
        });

        it('returns a copy of the entity when there is no extends', () => {
            er.declareEntity('sword', { entityType: 'ENTITY_TYPE_ITEM', damage: '1d6' });
            expect(er.resolveEntity('sword')).toEqual({
                entityType: 'ENTITY_TYPE_ITEM',
                damage: '1d6',
            });
        });

        it('strips the extends field from the resolved entity', () => {
            er.declareEntity('base', { entityType: 'ENTITY_TYPE_ITEM', damage: '1d4' });
            er.declareEntity('child', { extends: ['base'], entityType: 'ENTITY_TYPE_ITEM' });
            const result = er.resolveEntity('child');
            expect(result).not.toHaveProperty('extends');
        });

        it('does not mutate the stored entity', () => {
            er.declareEntity('base', { entityType: 'ENTITY_TYPE_ITEM', tags: ['a'] });
            er.declareEntity('child', { extends: ['base'], entityType: 'ENTITY_TYPE_ITEM', tags: ['b'] });
            er.resolveEntity('child');
            expect(er.resolveEntity('base')).toEqual({ entityType: 'ENTITY_TYPE_ITEM', tags: ['a'] });
        });
    });

    // ─── resolveEntity — single inheritance ──────────────────────────────────

    describe('resolveEntity — single inheritance', () => {
        beforeEach(() => {
            er.declareEntity('base', {
                entityType: 'ENTITY_TYPE_CREATURE',
                size: 'CREATURE_SIZE_MEDIUM',
                tags: ['living'],
            });
        });

        it('inherits a missing scalar property from the parent', () => {
            er.declareEntity('child', { extends: ['base'], entityType: 'ENTITY_TYPE_CREATURE' });
            expect(er.resolveEntity('child').size).toBe('CREATURE_SIZE_MEDIUM');
        });

        it('child scalar value wins over parent', () => {
            er.declareEntity('child', {
                extends: ['base'],
                entityType: 'ENTITY_TYPE_CREATURE',
                size: 'CREATURE_SIZE_LARGE',
            });
            expect(er.resolveEntity('child').size).toBe('CREATURE_SIZE_LARGE');
        });

        it('child array is prepended with parent array items', () => {
            er.declareEntity('child', {
                extends: ['base'],
                entityType: 'ENTITY_TYPE_CREATURE',
                tags: ['hero'],
            });
            expect(er.resolveEntity('child').tags).toEqual(['hero', 'living']);
        });

        it('inherits a parent array when child has no such field', () => {
            er.declareEntity('child', { extends: ['base'], entityType: 'ENTITY_TYPE_CREATURE' });
            expect(er.resolveEntity('child').tags).toEqual(['living']);
        });
    });

    // ─── resolveEntity — multiple parents ────────────────────────────────────

    describe('resolveEntity — multiple parents', () => {
        beforeEach(() => {
            er.declareEntity('p1', { entityType: 'ENTITY_TYPE_CREATURE', a: 1, tags: ['p1'] });
            er.declareEntity('p2', { entityType: 'ENTITY_TYPE_CREATURE', b: 2, tags: ['p2'] });
        });

        it('inherits scalar properties from all parents', () => {
            er.declareEntity('child', { extends: ['p1', 'p2'], entityType: 'ENTITY_TYPE_CREATURE' });
            const result = er.resolveEntity('child');
            expect(result.a).toBe(1);
            expect(result.b).toBe(2);
        });

        it('first parent wins when both parents define the same scalar', () => {
            er.declareEntity('p3', { entityType: 'ENTITY_TYPE_CREATURE', a: 99 });
            er.declareEntity('child', { extends: ['p1', 'p3'], entityType: 'ENTITY_TYPE_CREATURE' });
            expect(er.resolveEntity('child').a).toBe(1);
        });

        it('arrays from all parents are merged in extends order', () => {
            er.declareEntity('child', {
                extends: ['p1', 'p2'],
                entityType: 'ENTITY_TYPE_CREATURE',
                tags: ['child'],
            });
            expect(er.resolveEntity('child').tags).toEqual(['child', 'p1', 'p2']);
        });
    });

    // ─── resolveEntity — deep inheritance ────────────────────────────────────

    describe('resolveEntity — deep inheritance', () => {
        it('grandparent properties flow through to grandchild', () => {
            er.declareEntity('grandparent', { entityType: 'ENTITY_TYPE_CREATURE', origin: 'grandparent' });
            er.declareEntity('parent', { extends: ['grandparent'], entityType: 'ENTITY_TYPE_CREATURE' });
            er.declareEntity('child', { extends: ['parent'], entityType: 'ENTITY_TYPE_CREATURE' });
            expect(er.resolveEntity('child').origin).toBe('grandparent');
        });

        it('closer ancestor wins over a more distant one', () => {
            er.declareEntity('grandparent', { entityType: 'ENTITY_TYPE_CREATURE', level: 1 });
            er.declareEntity('parent', { extends: ['grandparent'], entityType: 'ENTITY_TYPE_CREATURE', level: 2 });
            er.declareEntity('child', { extends: ['parent'], entityType: 'ENTITY_TYPE_CREATURE' });
            expect(er.resolveEntity('child').level).toBe(2);
        });

        it('deep arrays accumulate across the whole chain', () => {
            er.declareEntity('grandparent', { entityType: 'ENTITY_TYPE_CREATURE', tags: ['gp'] });
            er.declareEntity('parent', { extends: ['grandparent'], entityType: 'ENTITY_TYPE_CREATURE', tags: ['p'] });
            er.declareEntity('child', { extends: ['parent'], entityType: 'ENTITY_TYPE_CREATURE', tags: ['c'] });
            expect(er.resolveEntity('child').tags).toEqual(['c', 'p', 'gp']);
        });
    });

    // ─── resolveEntity — circular reference ──────────────────────────────────

    describe('resolveEntity — circular reference', () => {
        it('does not throw or loop infinitely on a direct self-reference', () => {
            er.declareEntity('loop', { extends: ['loop'], entityType: 'ENTITY_TYPE_CREATURE' });
            expect(() => er.resolveEntity('loop')).not.toThrow();
        });

        it('does not throw or loop infinitely on a mutual reference', () => {
            er.declareEntity('a', { extends: ['b'], entityType: 'ENTITY_TYPE_CREATURE', v: 'a' });
            er.declareEntity('b', { extends: ['a'], entityType: 'ENTITY_TYPE_CREATURE', v: 'b' });
            expect(() => er.resolveEntity('a')).not.toThrow();
        });

        it('still resolves own properties despite a circular extends', () => {
            er.declareEntity('loop', { extends: ['loop'], entityType: 'ENTITY_TYPE_CREATURE', x: 42 });
            expect(er.resolveEntity('loop').x).toBe(42);
        });
    });
});
