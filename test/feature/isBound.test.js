// eslint-disable-next-line max-classes-per-file
import { describe, expect, test } from '@jest/globals';

import { testIndex, getTestCandidateBySpecificationKey } from './__config';

import {
  alwaysInstantiatingBuiltInConstructors,
  typeCoercionBuiltInConstructors,
  exclusivelyNewableBuiltInConstructors,
  exclusivelyNonNewableBuiltInConstructors,
} from '../../src/config';

import {
  canBeBoundDistinctively,
  hasBoundCallFuzziness,
  isBound,
  isBoundUnnamed,
} from '../../src/feature/isBound';

import { getFunctionName } from '../../src/utility';

describe('Testing all `Function` introspection methods related to any kind of **bound** functionality ...', () => {
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

  describe('... the introspection method `canBeBoundDistinctively` ...', () => {
    describe('... for any **unbound** function ...', () => {
      test('- filters the correct amount of items from any given array of mixed function types.', () => {
        expect(
          allTestEntries.filter(([key /* , spec */]) =>
            canBeBoundDistinctively(getTestCandidateBySpecificationKey(key)),
          ).length,
        ).toBe(
          allTestEntries
            // eslint-disable-next-line no-unused-vars
            .filter(([_, spec]) => !spec.can_not_be_distinctively_bound).length,
        );

        // counter check on the test configuration.
        expect(
          allTestEntries
            // eslint-disable-next-line no-unused-vars
            .filter(([_, spec]) => !spec.can_not_be_distinctively_bound).length,
        ).toBe(20);

        expect(
          allTestEntries.filter(
            ([key /* , spec */]) =>
              !canBeBoundDistinctively(getTestCandidateBySpecificationKey(key)),
          ).length,
        ).toBe(
          allTestEntries
            // eslint-disable-next-line no-unused-vars
            .filter(([_, spec]) => !!spec.can_not_be_distinctively_bound)
            .length,
        );

        // counter check on the test configuration.
        expect(
          allTestEntries
            // eslint-disable-next-line no-unused-vars
            .filter(([_, spec]) => !!spec.can_not_be_distinctively_bound)
            .length,
        ).toBe(3);
      });

      describe('... verifies whether ...', () => {
        allTestEntries
          // eslint-disable-next-line no-unused-vars
          .filter(([_, spec]) => !spec.can_not_be_distinctively_bound)
          .forEach(([key, spec]) => {
            const candidate = getTestCandidateBySpecificationKey(key);
            test(`- ${spec.description} can be distinctively bound.`, () => {
              expect(canBeBoundDistinctively(candidate)).toBe(true);
            });
          });
        allBuiltInTypes.forEach(candidate => {
          test(`- the built-in \`${getFunctionName(
            candidate,
          )}\` type can be distinctively bound.`, () => {
            expect(canBeBoundDistinctively(candidate)).toBe(true);
          });
        });

        allTestEntries
          // eslint-disable-next-line no-unused-vars
          .filter(([_, spec]) => !!spec.can_not_be_distinctively_bound)
          .forEach(([key, spec]) => {
            const candidate = getTestCandidateBySpecificationKey(key);
            test(`- ${spec.description} can **not** be distinctively bound.`, () => {
              expect(canBeBoundDistinctively(candidate)).toBe(false);
            });
          });

        test('- an `Array` instance can **not** be distinctively bound.', () => {
          expect(canBeBoundDistinctively([])).toBe(false);
        });
        test('- an `Object` instance can **not** be distinctively bound.', () => {
          expect(canBeBoundDistinctively({})).toBe(false);
        });
      });
    });

    describe('... for any (even multiple times) **bound** function ...', () => {
      test('- filters the correct amount of items from any given array of bound mixed function types.', () => {
        expect(
          allTestEntries.filter(([key /* , spec */]) =>
            canBeBoundDistinctively(
              getTestCandidateBySpecificationKey(key).bind().bind(),
            ),
          ).length,
        ).toBe(
          allTestEntries
            // eslint-disable-next-line no-unused-vars
            .filter(([_, spec]) => !spec.can_not_be_distinctively_bound).length,
        );

        // counter check on the test configuration.
        expect(
          allTestEntries
            // eslint-disable-next-line no-unused-vars
            .filter(([_, spec]) => !spec.can_not_be_distinctively_bound).length,
        ).toBe(20);

        expect(
          allTestEntries.filter(
            ([key /* , spec */]) =>
              !canBeBoundDistinctively(
                getTestCandidateBySpecificationKey(key).bind().bind(),
              ),
          ).length,
        ).toBe(
          allTestEntries
            // eslint-disable-next-line no-unused-vars
            .filter(([_, spec]) => !!spec.can_not_be_distinctively_bound)
            .length,
        );

        // counter check on the test configuration.
        expect(
          allTestEntries
            // eslint-disable-next-line no-unused-vars
            .filter(([_, spec]) => !!spec.can_not_be_distinctively_bound)
            .length,
        ).toBe(3);
      });

      describe('... verifies whether the **already bound** variant of ...', () => {
        allTestEntries
          // eslint-disable-next-line no-unused-vars
          .filter(([_, spec]) => !spec.can_not_be_distinctively_bound)
          .forEach(([key, spec]) => {
            const candidate = getTestCandidateBySpecificationKey(key);
            test(`- ${spec.description} **again** can be distinctively bound.`, () => {
              expect(canBeBoundDistinctively(candidate.bind())).toBe(true);
            });
          });
        allBuiltInTypes.forEach(candidate => {
          test(`- the built-in \`${getFunctionName(
            candidate,
          )}\` type **again** can be distinctively bound.`, () => {
            expect(canBeBoundDistinctively(candidate.bind())).toBe(true);
          });
        });

        allTestEntries
          // eslint-disable-next-line no-unused-vars
          .filter(([_, spec]) => !!spec.can_not_be_distinctively_bound)
          .forEach(([key, spec]) => {
            const candidate = getTestCandidateBySpecificationKey(key);
            test(`- ${spec.description} can **not** be distinctively bound.`, () => {
              expect(canBeBoundDistinctively(candidate)).toBe(false);
            });
          });
      });
    });
  });

  describe('... the introspection method `hasBoundCallFuzziness` ...', () => {
    describe('... for any **unbound** function ...', () => {
      test('- filters the correct amount of items from any given array of mixed function types.', () => {
        expect(
          allTestEntries.filter(([key /* , spec */]) =>
            hasBoundCallFuzziness(getTestCandidateBySpecificationKey(key)),
          ).length,
        ).toBe(0);

        expect(
          allTestEntries.filter(
            ([key /* , spec */]) =>
              !hasBoundCallFuzziness(getTestCandidateBySpecificationKey(key)),
          ).length,
        ).toBe(allTestEntries.length);
      });
    });

    describe('... for any (even multiple times) **bound** function ...', () => {
      test('- filters the correct amount of items from any given array of bound mixed function types.', () => {
        expect(
          allTestEntries.filter(([key /* , spec */]) =>
            hasBoundCallFuzziness(
              getTestCandidateBySpecificationKey(key).bind(),
            ),
          ).length,
        ).toBe(
          allTestEntries
            // eslint-disable-next-line no-unused-vars
            .filter(([_, spec]) => !!spec.can_not_be_distinctively_bound)
            .length,
        );

        // counter check on the test configuration.
        expect(
          allTestEntries
            // eslint-disable-next-line no-unused-vars
            .filter(([_, spec]) => !!spec.can_not_be_distinctively_bound)
            .length,
        ).toBe(3);

        expect(
          allTestEntries.filter(
            ([key /* , spec */]) =>
              !hasBoundCallFuzziness(
                getTestCandidateBySpecificationKey(key).bind().bind().bind(),
              ),
          ).length,
        ).toBe(
          allTestEntries
            // eslint-disable-next-line no-unused-vars
            .filter(([_, spec]) => !spec.can_not_be_distinctively_bound).length,
        );

        // counter check on the test configuration.
        expect(
          allTestEntries
            // eslint-disable-next-line no-unused-vars
            .filter(([_, spec]) => !spec.can_not_be_distinctively_bound).length,
        ).toBe(20);
      });

      describe('... verifies whether the callability of the **already bound** variant of ...', () => {
        allTestEntries
          // eslint-disable-next-line no-unused-vars
          .filter(([_, spec]) => !!spec.can_not_be_distinctively_bound)
          .forEach(([key, spec]) => {
            const candidate = getTestCandidateBySpecificationKey(key);
            test(`- ${spec.description} can neither be traced nor safely assured.`, () => {
              expect(hasBoundCallFuzziness(candidate.bind())).toBe(true);
            });
          });
        allBuiltInTypes.forEach(candidate => {
          test(`- the built-in \`${getFunctionName(
            candidate,
          )}\` type is clearly traceable.`, () => {
            expect(hasBoundCallFuzziness(candidate.bind().bind())).toBe(false);
          });
        });

        allTestEntries
          // eslint-disable-next-line no-unused-vars
          .filter(([_, spec]) => !spec.can_not_be_distinctively_bound)
          .forEach(([key, spec]) => {
            const candidate = getTestCandidateBySpecificationKey(key);
            test(`- ${spec.description} is clearly traceable.`, () => {
              expect(
                hasBoundCallFuzziness(candidate.bind().bind().bind()),
              ).toBe(false);
            });
          });
      });
    });
  });

  describe('The introspection method `isBound` verifies whether ...', () => {
    test('- an `Array` instance is **not** a bound function type.', () => {
      expect(isBound([])).toBe(false);
    });
    test('- an `Object` instance is **not** a bound function type.', () => {
      expect(isBound({})).toBe(false);
    });
    test('- a function which is named "bound" still is an **unbound** function type.', () => {
      function bound() {}
      expect(isBound(bound)).toBe(false);
    });

    allTestEntries.forEach(([key, spec]) => {
      const candidate = getTestCandidateBySpecificationKey(key);
      test(`- ${spec.description} is an **unbound** function type.`, () => {
        expect(isBound(candidate)).toBe(false);
      });
    });
    allBuiltInTypes.forEach(candidate => {
      test(`- the built-in \`${getFunctionName(
        candidate,
      )}\` type is an **unbound** function type.`, () => {
        expect(isBound(candidate)).toBe(false);
      });
    });

    allTestEntries.forEach(([key, spec]) => {
      const candidate = getTestCandidateBySpecificationKey(key);
      test(`- the **single bound** variant of ${spec.description} actually is a bound function type.`, () => {
        expect(isBound(candidate.bind())).toBe(true);
      });
    });
    allBuiltInTypes.forEach(candidate => {
      test(`- the **multiple bound** variant of the built-in \`${getFunctionName(
        candidate,
      )}\` type actually is a bound function type.`, () => {
        expect(isBound(candidate.bind().bind().bind())).toBe(true);
      });
    });
  });

  describe('The introspection method `isBoundUnnamed` ...', () => {
    test('- filters the correct amount of items from a given array of mixed and all **bound** function types.', () => {
      expect(
        allTestEntries.filter(([key /* , spec */]) =>
          isBoundUnnamed(getTestCandidateBySpecificationKey(key).bind()),
        ).length,
      ).toBe(
        [
          ...Object.entries(functions.unnamed),
          ...Object.entries(classes.unnamed),
        ].length,
      );
    });

    describe('... verifies whether ...', () => {
      [
        ...Object.entries(functions.unnamed),
        ...Object.entries(classes.unnamed),
      ].forEach(([key, spec]) => {
        const candidate = getTestCandidateBySpecificationKey(key);
        test(`- the **multiple bound** variant of ${spec.description} actually is a **bound unnamed** function type.`, () => {
          expect(isBoundUnnamed(candidate.bind().bind().bind())).toBe(true);
        });
      });

      [
        ...Object.entries(functions.named),
        ...Object.entries(classes.named),
        ...Object.entries(testIndex.specification.other),
      ].forEach(([key, spec]) => {
        const candidate = getTestCandidateBySpecificationKey(key);
        test(`- the **single bound** variant of ${spec.description} is **not** a **bound unnamed** function type.`, () => {
          expect(isBoundUnnamed(candidate.bind())).toBe(false);
        });
      });

      test('- a function which is named "bound" is **not** a **bound unnamed** function type.', () => {
        function bound() {}
        expect(isBoundUnnamed(bound)).toBe(false);
      });

      test('- an `Array` instance is **not** a **bound unnamed** function type.', () => {
        expect(isBoundUnnamed([])).toBe(false);
      });
      test('- an `Object` instance is **not** a **bound unnamed** function type.', () => {
        expect(isBoundUnnamed({})).toBe(false);
      });
    });
  });
});
