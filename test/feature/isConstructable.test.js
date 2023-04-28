import { describe, expect, test } from '@jest/globals';

import { testIndex, getTestCandidateBySpecificationKey } from './__config';

import {
  alwaysInstantiatingBuiltInConstructors,
  typeCoercionBuiltInConstructors,
  exclusivelyNewableBuiltInConstructors,
  exclusivelyNonNewableBuiltInConstructors,
} from '../../src/config';

import { getFunctionName } from '../../src/utility';
import { isAsyncType, isGeneratorType } from '../../src/feature/isFunction';

import {
  hasConstructSlot,
  isConstructable,
  isConstructableWithNew,
  isConstructableWithoutNew,
} from '../../src/feature/isConstructable';

describe('Testing all `Function` introspection methods related to being **constructable** ...', () => {
  const {
    specification: { function: functions, class: classes },
  } = testIndex;

  const allTestEntries = [
    ...Object.entries(functions.unnamed),
    ...Object.entries(functions.named),
    ...Object.entries(classes.unnamed),
    ...Object.entries(classes.named),
    ...Object.entries(testIndex.specification.other),
  ];

  const allBuiltInTypes = [
    ...new Set([
      ...alwaysInstantiatingBuiltInConstructors,
      ...typeCoercionBuiltInConstructors,
      ...exclusivelyNewableBuiltInConstructors,
      ...exclusivelyNonNewableBuiltInConstructors,
    ]),
  ];

  const allBuiltInTypesConstructableWithNew = [
    ...new Set([
      ...alwaysInstantiatingBuiltInConstructors,
      ...typeCoercionBuiltInConstructors,
      ...exclusivelyNewableBuiltInConstructors,
      // ...exclusivelyNonNewableBuiltInConstructors,
    ]),
  ];
  const allBuiltInTypesConstructableWithoutNew = [
    ...new Set([
      ...alwaysInstantiatingBuiltInConstructors,
      // ...typeCoercionBuiltInConstructors,
      // ...exclusivelyNewableBuiltInConstructors,
      ...exclusivelyNonNewableBuiltInConstructors,
    ]),
  ];

  describe('The introspection method `hasConstructSlot` ...', () => {
    test('- filters the correct amount of items from a given array of mixed function types.', () => {
      expect(
        allTestEntries.filter(([key /* , spec */]) =>
          hasConstructSlot(getTestCandidateBySpecificationKey(key)),
        ).length,
      ).toBe(
        allTestEntries
          // eslint-disable-next-line no-unused-vars
          .filter(([_, spec]) => !spec.has_no_construct_slot).length,
      );
      // counter check on the test configuration.
      expect(
        allTestEntries
          // eslint-disable-next-line no-unused-vars
          .filter(([_, spec]) => !!spec.has_no_construct_slot).length,
      ).toBe(13);
    });

    describe('... verifies whether ...', () => {
      allTestEntries
        // eslint-disable-next-line no-unused-vars
        .filter(([_, spec]) => !spec.has_no_construct_slot)
        .forEach(([key, spec]) => {
          const candidate = getTestCandidateBySpecificationKey(key);
          test(`- ${spec.description} is **possibly constructable**.`, () => {
            expect(hasConstructSlot(candidate)).toBe(true);
          });
        });
      allBuiltInTypes.forEach(candidate => {
        test(`- the built-in \`${getFunctionName(
          candidate,
        )}\` type is **possibly constructable**.`, () => {
          expect(hasConstructSlot(candidate)).toBe(true);
        });
      });

      allTestEntries
        // eslint-disable-next-line no-unused-vars
        .filter(([_, spec]) => !!spec.has_no_construct_slot)
        .forEach(([key, spec]) => {
          const candidate = getTestCandidateBySpecificationKey(key);
          const annotation =
            (isGeneratorType(candidate) &&
              ' (Note: ...though generators in fact are constructable)') ||
            '';
          test(`- ${spec.description} is **most probably not constructable** ${annotation}.`, () => {
            expect(hasConstructSlot(candidate)).toBe(false);
          });
        });

      test('- an `Array` instance does not feature a `[[construct]]` slot.', () => {
        expect(isConstructable([])).toBe(false);
      });
      test('- an `Object` instance does not feature a `[[construct]]` slot.', () => {
        expect(isConstructable({})).toBe(false);
      });
    });
  });

  describe('The introspection method `isConstructable` ...', () => {
    test('- filters the correct amount of items from a given array of mixed function types.', () => {
      expect(
        allTestEntries.filter(([key /* , spec */]) =>
          isConstructable(getTestCandidateBySpecificationKey(key)),
        ).length,
      ).toBe(
        allTestEntries
          // eslint-disable-next-line no-unused-vars
          .filter(([_, spec]) => !!spec.constructable).length,
      );

      // counter check on the test configuration.
      expect(
        allTestEntries
          // eslint-disable-next-line no-unused-vars
          .filter(([_, spec]) => !!spec.constructable).length,
      ).toBe(16);
    });

    describe('... verifies whether ...', () => {
      allTestEntries
        // eslint-disable-next-line no-unused-vars
        .filter(([_, spec]) => !!spec.constructable)
        .forEach(([key, spec]) => {
          const candidate = getTestCandidateBySpecificationKey(key);
          test(`- ${spec.description} is **constructable**.`, () => {
            expect(isConstructable(candidate)).toBe(true);
          });
        });
      allBuiltInTypes.forEach(candidate => {
        test(`- the built-in \`${getFunctionName(
          candidate,
        )}\` type is **constructable**.`, () => {
          expect(isConstructable(candidate)).toBe(true);
        });
      });

      allTestEntries
        // eslint-disable-next-line no-unused-vars
        .filter(([_, spec]) => !spec.constructable)
        .forEach(([key, spec]) => {
          const candidate = getTestCandidateBySpecificationKey(key);
          test(`- ${spec.description} is **not constructable**.`, () => {
            expect(isConstructable(candidate)).toBe(false);
          });
        });

      test('- an `Array` instance is **not constructable**.', () => {
        expect(isConstructable([])).toBe(false);
      });
      test('- an `Object` instance is **not constructable**.', () => {
        expect(isConstructable({})).toBe(false);
      });
    });
  });

  describe('The introspection method `isConstructableWithNew` ...', () => {
    test('- filters the correct amount of items from any given array of mixed function types.', () => {
      expect(
        allTestEntries.filter(([key /* , spec */]) =>
          isConstructableWithNew(getTestCandidateBySpecificationKey(key)),
        ).length,
      ).toBe(
        allTestEntries
          // eslint-disable-next-line no-unused-vars
          .filter(([_, spec]) => !!spec.constructableWithNew).length,
      );

      // counter check on the test configuration.
      expect(
        allTestEntries
          // eslint-disable-next-line no-unused-vars
          .filter(([_, spec]) => !!spec.constructableWithNew).length,
      ).toBe(10);

      // counter check on the top most configuration.
      expect(
        allBuiltInTypes.filter(isConstructableWithNew).length,
      ).toStrictEqual(allBuiltInTypesConstructableWithNew.length);
    });

    describe('... verifies whether ...', () => {
      allTestEntries
        // eslint-disable-next-line no-unused-vars
        .filter(([_, spec]) => !!spec.constructableWithNew)
        .forEach(([key, spec]) => {
          const Candidate = getTestCandidateBySpecificationKey(key);
          test(`- ${spec.description} can be safely invoked with the \`new\` operator.`, () => {
            expect(isConstructableWithNew(Candidate)).toBe(true);

            // - proving the introspection method by
            //   actually invoking the function type.
            expect(() => new Candidate(...(spec.args ?? []))).not.toThrow();
            expect(new Candidate(...(spec.args ?? []))).toBeInstanceOf(
              Candidate,
            );
          });
        });

      allBuiltInTypesConstructableWithNew.forEach(Candidate => {
        test(`- the built-in \`${getFunctionName(
          Candidate,
        )}\` type can be safely invoked with the \`new\` operator.`, () => {
          expect(isConstructableWithNew(Candidate)).toBe(true);

          // - proving the introspection method by
          //   actually invoking the function type.
          const args = (Candidate === Proxy && [{}, {}]) || [''];

          expect(() => new Candidate(...args)).not.toThrow();

          // - a `Proxy` does not construct a
          //   detectable instance of itself.
          if (Candidate !== Proxy) {
            expect(new Candidate(...args)).toBeInstanceOf(Candidate);
          }
        });
      });

      allTestEntries
        // eslint-disable-next-line no-unused-vars
        .filter(([_, spec]) => !spec.constructableWithNew)
        .forEach(([key, spec]) => {
          const Candidate = getTestCandidateBySpecificationKey(key);
          test(`- invoking ${spec.description} with the \`new\` operator is going to fail.`, () => {
            expect(isConstructableWithNew(Candidate)).toBe(false);

            // - proving the introspection method by
            //   actually invoking the function type.
            expect(() => new Candidate(...(spec.args ?? []))).toThrow(
              TypeError,
            );
          });
        });

      [...exclusivelyNonNewableBuiltInConstructors].forEach(Candidate => {
        test(`- invoking the built-in \`${getFunctionName(
          Candidate,
        )}\` type with the \`new\` operator is going to fail.`, () => {
          expect(isConstructableWithNew(Candidate)).toBe(false);

          // - proving the introspection method by
          //   actually invoking the function type.
          expect(() => new Candidate()).toThrow(TypeError);
        });
      });
    });
  });

  describe('The introspection method `isConstructableWithoutNew` ...', () => {
    test('- filters the correct amount of items from any given array of mixed function types.', () => {
      expect(
        allTestEntries.filter(([key /* , spec */]) =>
          isConstructableWithoutNew(getTestCandidateBySpecificationKey(key)),
        ).length,
      ).toBe(
        allTestEntries
          // eslint-disable-next-line no-unused-vars
          .filter(([_, spec]) => !!spec.constructableWithoutNew).length,
      );

      // counter check on the test configuration.
      expect(
        allTestEntries
          // eslint-disable-next-line no-unused-vars
          .filter(([_, spec]) => !!spec.constructableWithoutNew).length,
      ).toBe(6);

      // counter check on the top most configuration.
      expect(
        allBuiltInTypes.filter(isConstructableWithoutNew).length,
      ).toStrictEqual(allBuiltInTypesConstructableWithoutNew.length);
      expect(
        allBuiltInTypes.filter(
          candidate =>
            isConstructableWithNew(candidate) &&
            isConstructableWithoutNew(candidate),
        ).length,
      ).toStrictEqual([...alwaysInstantiatingBuiltInConstructors].length);
    });

    describe('... verifies whether ...', () => {
      allTestEntries
        // eslint-disable-next-line no-unused-vars
        .filter(([_, spec]) => !!spec.constructableWithoutNew)
        .forEach(([key, spec]) => {
          const Candidate = getTestCandidateBySpecificationKey(key);
          test(`- ${spec.description} creates an own instance by being invoked with just the call/\`()\` operator.`, () => {
            expect(isConstructableWithoutNew(Candidate)).toBe(true);

            // - proving the introspection method by
            //   actually invoking the function type.
            expect(() => Candidate(...(spec.args ?? []))).not.toThrow();
            expect(Candidate(...(spec.args ?? []))).toBeInstanceOf(Candidate);
          });
        });

      allBuiltInTypesConstructableWithoutNew.forEach(Candidate => {
        const typeName = getFunctionName(Candidate);
        const itemName =
          (/^symbol|bigint$/.test(typeName.toLowerCase()) &&
            '(primitive) value') ||
          'instance';

        test(`- the built-in \`${typeName}\` type creates an own ${itemName} by being invoked with just the call/\`()\` operator.`, () => {
          expect(isConstructableWithoutNew(Candidate)).toBe(true);

          // - proving the introspection method by
          //   actually invoking the function type.
          expect(() => Candidate('')).not.toThrow();

          const type = Candidate('');
          const isInstance =
            // - targeting instance creating constructors.
            type instanceof Candidate ||
            // - targeting both value creating constructors, `Symbol` and `BigInt`.
            /^symbol|bigint$/.test(typeof type);
          expect(isInstance).toBe(true);
        });
      });

      const notConstructableWithoutNewEntries = allTestEntries
        // eslint-disable-next-line no-unused-vars
        .filter(([_, spec]) => !spec.constructableWithoutNew);

      const callableNonAsyncEntries = notConstructableWithoutNewEntries.filter(
        ([key, spec]) =>
          !!spec.callable &&
          !isAsyncType(getTestCandidateBySpecificationKey(key)),
      );

      callableNonAsyncEntries.forEach(([key, spec]) => {
        const Candidate = getTestCandidateBySpecificationKey(key);
        test(`- invoking ${spec.description} with just the call/\`()\` operator does not create an own instance.`, () => {
          expect(isConstructableWithoutNew(Candidate)).toBe(false);

          // - proving the introspection method by
          //   actually invoking the function type.
          expect(() => Candidate('')).not.toThrow();

          expect(Candidate('') instanceof Candidate).toBe(false);
        });
      });

      // @TODO ... think about further test cases which
      //           are based on negation and throwing.
    });
  });
});
