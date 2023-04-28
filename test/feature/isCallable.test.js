import { describe, expect, test } from '@jest/globals';

import { testIndex, getTestCandidateBySpecificationKey } from './__config';

import {
  callableBuiltInConstructors,
  exclusivelyNewableBuiltInConstructors,
} from '../../src/config';

import { getFunctionName } from '../../src/utility';
import {
  isClass,
  isES3Function,
  isUnnamedFunction,
} from '../../src/feature/isFunction';

import { isCallable } from '../../src/feature/isCallable';

describe('Testing all `Function` introspection methods related to being just **callable** ...', () => {
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

  describe('... for any **unbound** function ...', () => {
    describe('... the introspection method `isCallable` ...', () => {
      test('- filters the correct amount of items from a given array of mixed function types.', () => {
        expect(
          allTestEntries.filter(([key /* , spec */]) =>
            isCallable(getTestCandidateBySpecificationKey(key)),
          ).length,
        ).toBe(
          allTestEntries
            // eslint-disable-next-line no-unused-vars
            .filter(([_, spec]) => !!spec.callable).length,
        );
        // counter check on the test configuration.
        expect(
          allTestEntries
            // eslint-disable-next-line no-unused-vars
            .filter(([_, spec]) => !!spec.callable).length,
        ).toBe(17);
      });

      describe('... verifies whether ...', () => {
        allTestEntries
          // eslint-disable-next-line no-unused-vars
          .filter(([_, spec]) => !!spec.callable)
          .forEach(([key, spec]) => {
            const candidate = getTestCandidateBySpecificationKey(key);
            test(`- ${spec.description} can be safely invoked with just the call/\`()\` operator.`, () => {
              expect(isCallable(candidate)).toBe(true);

              // - proving the introspection method by
              //   actually invoking the function type.
              expect(() => candidate(...(spec.args ?? []))).not.toThrow();
            });
          });

        callableBuiltInConstructors.forEach(candidate => {
          test(`- the built-in \`${getFunctionName(
            candidate,
          )}\` type  can be safely invoked with just the call/\`()\` operator.`, () => {
            expect(isCallable(candidate)).toBe(true);

            // - proving the introspection method by
            //   actually invoking the function type.
            expect(() => candidate('')).not.toThrow();
          });
        });

        allTestEntries
          // eslint-disable-next-line no-unused-vars
          .filter(([_, spec]) => !spec.callable)
          .forEach(([key, spec]) => {
            const candidate = getTestCandidateBySpecificationKey(key);
            test(`- invoking ${spec.description} with just the call/\`()\` operator is going to fail.`, () => {
              expect(isCallable(candidate)).toBe(false);

              // - proving the introspection method by
              //   actually invoking the function type.

              expect(() =>
                candidate(...(spec.args ?? [])),
              ).toThrow(/* TypeError */);
            });
          });

        [...exclusivelyNewableBuiltInConstructors].forEach(candidate => {
          test(`- invoking the built-in \`${getFunctionName(
            candidate,
          )}\` type with just the call/\`()\` operator is going to fail.`, () => {
            expect(isCallable(candidate)).toBe(false);

            // - proving the introspection method by
            //   actually invoking the function type.
            expect(() => candidate('')).toThrow(TypeError);
          });
        });

        test('- an `Array` instance is **not callable**.', () => {
          expect(isCallable([])).toBe(false);
        });
        test('- an `Object` instance is **not callable**.', () => {
          expect(isCallable({})).toBe(false);
        });
      });
    });
  });

  // callability testing of bound variants of callable and not callable function type's.

  describe('... for any **bound** function ...', () => {
    describe('... the introspection method `isCallable` verifies whether ...', () => {
      allTestEntries
        // eslint-disable-next-line no-unused-vars
        .filter(([_, spec]) => !!spec.callable)
        .forEach(([key, spec]) => {
          const candidate = getTestCandidateBySpecificationKey(key);
          // The next following clause is due to the following issue:
          //
          //  - The `isCallable` introspection function throws a `RangeError`
          //    for passed values which are bound variants of either unnamed
          //    ES3 functions or unnamed class constructors because valid
          //    callability detection of such values is beyond this
          //    introspection function's range.
          //
          if (
            !isUnnamedFunction(candidate) ||
            !(isES3Function(candidate) || isClass(candidate))
          ) {
            test(`- the bound variant of ${spec.description}, which itself is callable, can be safely invoked with just the call/\`()\` operator.`, () => {
              expect(isCallable(candidate.bind(null))).toBe(true);

              // - proving the introspection method by
              //   actually invoking the function type.
              expect(() =>
                candidate.bind(null)(...(spec.args ?? [])),
              ).not.toThrow();
            });
          }
        });

      callableBuiltInConstructors.forEach(candidate => {
        test(`- the bound variant of the built-in \`${getFunctionName(
          candidate,
        )}\` type, which itself is callable, can be safely invoked with just the call/\`()\` operator.`, () => {
          expect(isCallable(candidate.bind(null))).toBe(true);

          // - proving the introspection method by
          //   actually invoking the function type.
          expect(() => candidate.bind(null)('')).not.toThrow();
        });
      });

      allTestEntries
        // eslint-disable-next-line no-unused-vars
        .filter(([_, spec]) => !spec.callable)
        .forEach(([key, spec]) => {
          const candidate = getTestCandidateBySpecificationKey(key);
          // The next following clause is due to the following issue:
          //
          //  - The `isCallable` introspection function throws a `RangeError`
          //    for passed values which are bound variants of either unnamed
          //    ES3 functions or unnamed class constructors because valid
          //    callability detection of such values is beyond this
          //    introspection function's range.
          //
          if (
            !isUnnamedFunction(candidate) ||
            !(isES3Function(candidate) || isClass(candidate))
          ) {
            test(`- invoking the bound variant of ${spec.description}, which itself is not callable, with just the call/\`()\` operator is going to fail.`, () => {
              expect(isCallable(candidate.bind(null))).toBe(false);

              // - proving the introspection method by
              //   actually invoking the function type.

              expect(() =>
                candidate.bind(null)(...(spec.args ?? [])),
              ).toThrow(/* TypeError */);
            });
          }
        });

      [...exclusivelyNewableBuiltInConstructors].forEach(candidate => {
        test(`- invoking the bound variant of the built-in \`${getFunctionName(
          candidate,
        )}\` type, which itself is not callable, with just the call/\`()\` operator is going to fail.`, () => {
          expect(isCallable(candidate.bind(null))).toBe(false);

          // - proving the introspection method by
          //   actually invoking the function type.
          expect(() => candidate.bind(null)('')).toThrow(TypeError);
        });
      });
    });
  });

  describe('... for any **bound** variant of either an unnamed ES3 function or an unnamed class constructor ...', () => {
    describe('... the introspection method `isCallable` ...', () => {
      const allThrowingWhenBoundTestEntriesByUnnamedFunctionTest =
        allTestEntries.filter(([key /* ,spec */]) => {
          const candidate = getTestCandidateBySpecificationKey(key);
          return (
            isUnnamedFunction(candidate) &&
            (isES3Function(candidate) || isClass(candidate))
          );
        });
      const allThrowingWhenBoundTestEntriesByEntrySpecification = allTestEntries
        // eslint-disable-next-line no-unused-vars
        .filter(([key, spec]) => spec.bound?.callable?.throws === RangeError);

      // ensure all **bound callable** related test cases are written
      // in a not self cheating but logic, proper, meaningful way.
      expect(
        allThrowingWhenBoundTestEntriesByUnnamedFunctionTest.length,
      ).toStrictEqual(
        allThrowingWhenBoundTestEntriesByEntrySpecification.length,
      );

      allThrowingWhenBoundTestEntriesByUnnamedFunctionTest.forEach(
        ([key, spec]) => {
          const candidate = getTestCandidateBySpecificationKey(key);
          test(`- does throw a \`RangeError\` e.g. for the bound variant of ${
            spec.description
          }, which itself is ${
            (!spec.callable && 'not ') || ''
          }callable, but can not anymore reliably be detected/distinguished in its bound variant.`, () => {
            expect(() => isCallable(candidate.bind(null))).toThrow(RangeError);
          });
        },
      );
    });
  });
});
