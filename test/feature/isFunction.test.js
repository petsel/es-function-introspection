import { describe, expect, test } from '@jest/globals';

import { testIndex, getTestCandidateBySpecificationKey } from './__config';

import {
  isFunction,
  isClass,
  isArrowType,
  isGeneratorType,
  isAsyncType,
  isAsyncGenerator,
  isGeneratorFunction,
  isAsyncFunction,
  isAsyncArrow,
  isNonAsyncArrow,
  isExtendedFunction,
  isES3Function,
  isGenericFunction,
  isUnnamedFunction,
} from '../../src/feature/isFunction';

describe('Testing all `Function` introspection methods related to function types ...', () => {
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

  describe('The introspection method `isFunction` ...', () => {
    test('- filters the correct amount of items from a given array of mixed function types.', () => {
      expect(
        allTestEntries.filter(([key /* , spec */]) =>
          isFunction(getTestCandidateBySpecificationKey(key)),
        ).length,
      ).toBe(allTestEntries.length);
    });

    describe('... verifies whether ...', () => {
      allTestEntries.forEach(([key, spec]) => {
        const candidate = getTestCandidateBySpecificationKey(key);

        test(`- ${spec.description} is a function type.`, () => {
          expect(isFunction(candidate)).toBe(true);
        });
      });
      test('- an `Array` instance is **not** a function type.', () => {
        expect(isFunction([])).toBe(false);
      });
      test('- an `Object` instance is **not** a function type.', () => {
        expect(isFunction({})).toBe(false);
      });
    });
  });

  describe('The introspection method `isClass` ...', () => {
    test('- filters the correct amount of items from a given array of mixed function types.', () => {
      const testEntries = [
        ...Object.entries(functions.unnamed),
        ...Object.entries(functions.named),
        ...Object.entries(classes.unnamed),
        ...Object.entries(classes.named),
        // - due to Web Api constructor functions like `EventTarget`
        //   or `URL` being implemented via class syntax within node
        //   environments (browsers are not effected).
        // // ...Object.entries(testIndex.specification.other),
      ];
      expect(
        testEntries.filter(([key /* , spec */]) =>
          isClass(getTestCandidateBySpecificationKey(key)),
        ).length,
      ).toBe(
        testEntries
          // eslint-disable-next-line no-unused-vars
          .filter(([_, spec]) => !!spec.is_class).length,
      );
    });

    describe('... verifies whether ...', () => {
      [
        ...Object.entries(classes.unnamed),
        ...Object.entries(classes.named),
      ].forEach(([key, spec]) => {
        const candidate = getTestCandidateBySpecificationKey(key);

        test(`- ${spec.description} is a constructor function type created with the \`class\` syntax.`, () => {
          expect(isClass(candidate)).toBe(true);
          expect(isClass(candidate)).toBe(spec.is_class);
        });
      });

      [
        ...Object.entries(functions.unnamed),
        ...Object.entries(functions.named),
      ].forEach(([key, spec]) => {
        const candidate = getTestCandidateBySpecificationKey(key);

        test(`- ${spec.description} is **not** a \`class\` constructor function.`, () => {
          expect(isClass(candidate)).toBe(false);
          expect(isClass(candidate)).toBe(!!spec.is_class);
        });
      });

      test('- an `Array` instance is **not** a `class` constructor function.', () => {
        expect(isClass([])).toBe(false);
      });
      test('- an `Object` instance is **not** a `class` constructor function.', () => {
        expect(isClass({})).toBe(false);
      });
    });
  });

  describe('The introspection method `isArrowType` ...', () => {
    test('- filters the correct amount of items from a given array of mixed function types.', () => {
      expect(
        allTestEntries.filter(([key /* , spec */]) =>
          isArrowType(getTestCandidateBySpecificationKey(key)),
        ).length,
      ).toBe(
        allTestEntries
          // eslint-disable-next-line no-unused-vars
          .filter(([_, spec]) => !!spec.is_arrow_type).length,
      );
    });

    describe('... verifies whether ...', () => {
      allTestEntries
        // eslint-disable-next-line no-unused-vars
        .filter(([_, spec]) => !!spec.is_arrow_type)
        .forEach(([key, spec]) => {
          const candidate = getTestCandidateBySpecificationKey(key);
          test(`- ${spec.description} is either kind of arrow function, async or not.`, () => {
            expect(isArrowType(candidate)).toBe(true);
          });
        });
      allTestEntries
        // eslint-disable-next-line no-unused-vars
        .filter(([_, spec]) => !spec.is_arrow_type)
        .forEach(([key, spec]) => {
          const candidate = getTestCandidateBySpecificationKey(key);
          test(`- ${spec.description} is **not** any kind of arrow function.`, () => {
            expect(isArrowType(candidate)).toBe(false);
          });
        });

      test('- an `Array` instance is **not** any kind of arrow function.', () => {
        expect(isArrowType([])).toBe(false);
      });
      test('- an `Object` instance is **not** any kind of arrow function.', () => {
        expect(isArrowType({})).toBe(false);
      });
    });
  });

  describe('The introspection method `isGeneratorType` ...', () => {
    test('- filters the correct amount of items from a given array of mixed function types.', () => {
      expect(
        allTestEntries.filter(([key /* , spec */]) =>
          isGeneratorType(getTestCandidateBySpecificationKey(key)),
        ).length,
      ).toBe(
        allTestEntries
          // eslint-disable-next-line no-unused-vars
          .filter(([_, spec]) => !!spec.is_generator_type).length,
      );
    });

    describe('... verifies whether ...', () => {
      allTestEntries
        // eslint-disable-next-line no-unused-vars
        .filter(([_, spec]) => !!spec.is_generator_type)
        .forEach(([key, spec]) => {
          const candidate = getTestCandidateBySpecificationKey(key);
          test(`- ${spec.description} is either kind of generator function, async or not.`, () => {
            expect(isGeneratorType(candidate)).toBe(true);
          });
        });
      allTestEntries
        // eslint-disable-next-line no-unused-vars
        .filter(([_, spec]) => !spec.is_generator_type)
        .forEach(([key, spec]) => {
          const candidate = getTestCandidateBySpecificationKey(key);
          test(`- ${spec.description} is **not** any kind of generator function.`, () => {
            expect(isGeneratorType(candidate)).toBe(false);
          });
        });

      test('- an `Array` instance is **not** any kind of generator function.', () => {
        expect(isGeneratorType([])).toBe(false);
      });
      test('- an `Object` instance is **not** any kind of generator function.', () => {
        expect(isGeneratorType({})).toBe(false);
      });
    });
  });

  describe('The introspection method `isAsyncType` ...', () => {
    test('- filters the correct amount of items from a given array of mixed function types.', () => {
      expect(
        allTestEntries.filter(([key /* , spec */]) =>
          isAsyncType(getTestCandidateBySpecificationKey(key)),
        ).length,
      ).toBe(
        allTestEntries
          // eslint-disable-next-line no-unused-vars
          .filter(([_, spec]) => !!spec.is_async_type).length,
      );
    });

    describe('... verifies whether ...', () => {
      allTestEntries
        // eslint-disable-next-line no-unused-vars
        .filter(([_, spec]) => !!spec.is_async_type)
        .forEach(([key, spec]) => {
          const candidate = getTestCandidateBySpecificationKey(key);
          test(`- ${spec.description} is any kind of async function type.`, () => {
            expect(isAsyncType(candidate)).toBe(true);
          });
        });
      allTestEntries
        // eslint-disable-next-line no-unused-vars
        .filter(([_, spec]) => !spec.is_async_type)
        .forEach(([key, spec]) => {
          const candidate = getTestCandidateBySpecificationKey(key);
          test(`- ${spec.description} is **not** any kind of async function.`, () => {
            expect(isAsyncType(candidate)).toBe(false);
          });
        });

      test('- an `Array` instance is **not** any kind of async function.', () => {
        expect(isAsyncType([])).toBe(false);
      });
      test('- an `Object` instance is **not** any kind of async function.', () => {
        expect(isAsyncType({})).toBe(false);
      });
    });
  });

  describe('The introspection method `isAsyncGenerator` ...', () => {
    test('- filters the correct amount of items from a given array of mixed function types.', () => {
      expect(
        allTestEntries.filter(([key /* , spec */]) =>
          isAsyncGenerator(getTestCandidateBySpecificationKey(key)),
        ).length,
      ).toBe(
        allTestEntries
          // eslint-disable-next-line no-unused-vars
          .filter(([_, spec]) => !!spec.is_async_generator).length,
      );
    });

    describe('... verifies whether ...', () => {
      allTestEntries
        // eslint-disable-next-line no-unused-vars
        .filter(([_, spec]) => !!spec.is_async_generator)
        .forEach(([key, spec]) => {
          const candidate = getTestCandidateBySpecificationKey(key);
          test(`- ${spec.description} is explicitly an \`AsyncGeneratorFunction\` type.`, () => {
            expect(isAsyncGenerator(candidate)).toBe(true);
          });
        });
      allTestEntries
        // eslint-disable-next-line no-unused-vars
        .filter(([_, spec]) => !spec.is_async_generator)
        .forEach(([key, spec]) => {
          const candidate = getTestCandidateBySpecificationKey(key);
          test(`- ${spec.description} is **not** explicitly an \`AsyncGeneratorFunction\` type.`, () => {
            expect(isAsyncGenerator(candidate)).toBe(false);
          });
        });

      test('- an `Array` instance is **not** explicitly an `AsyncGeneratorFunction` type.', () => {
        expect(isAsyncGenerator([])).toBe(false);
      });
      test('- an `Object` instance is **not** explicitly an `AsyncGeneratorFunction` type.', () => {
        expect(isAsyncGenerator({})).toBe(false);
      });
    });
  });

  describe('The introspection method `isGeneratorFunction` ...', () => {
    test('- filters the correct amount of items from a given array of mixed function types.', () => {
      expect(
        allTestEntries.filter(([key /* , spec */]) =>
          isGeneratorFunction(getTestCandidateBySpecificationKey(key)),
        ).length,
      ).toBe(
        allTestEntries
          // eslint-disable-next-line no-unused-vars
          .filter(([_, spec]) => !!spec.is_generator_function).length,
      );
    });

    describe('... verifies whether ...', () => {
      allTestEntries
        // eslint-disable-next-line no-unused-vars
        .filter(([_, spec]) => !!spec.is_generator_function)
        .forEach(([key, spec]) => {
          const candidate = getTestCandidateBySpecificationKey(key);
          test(`- ${spec.description} is explicitly a \`GeneratorFunction\` type.`, () => {
            expect(isGeneratorFunction(candidate)).toBe(true);
          });
        });
      allTestEntries
        // eslint-disable-next-line no-unused-vars
        .filter(([_, spec]) => !spec.is_generator_function)
        .forEach(([key, spec]) => {
          const candidate = getTestCandidateBySpecificationKey(key);
          test(`- ${spec.description} is **not** explicitly a \`GeneratorFunction\` type.`, () => {
            expect(isGeneratorFunction(candidate)).toBe(false);
          });
        });

      test('- an `Array` instance is **not** explicitly a `GeneratorFunction` type.', () => {
        expect(isGeneratorFunction([])).toBe(false);
      });
      test('- an `Object` instance is **not** explicitly a `GeneratorFunction` type.', () => {
        expect(isGeneratorFunction({})).toBe(false);
      });
    });
  });

  describe('The introspection method `isAsyncFunction` ...', () => {
    test('- filters the correct amount of items from a given array of mixed function types.', () => {
      expect(
        allTestEntries.filter(([key /* , spec */]) =>
          isAsyncFunction(getTestCandidateBySpecificationKey(key)),
        ).length,
      ).toBe(
        allTestEntries
          // eslint-disable-next-line no-unused-vars
          .filter(([_, spec]) => !!spec.is_async_function).length,
      );
    });

    describe('... verifies whether ...', () => {
      allTestEntries
        // eslint-disable-next-line no-unused-vars
        .filter(([_, spec]) => !!spec.is_async_function)
        .forEach(([key, spec]) => {
          const candidate = getTestCandidateBySpecificationKey(key);
          test(`- ${spec.description} is a kind of **non generator** async function.`, () => {
            expect(isAsyncFunction(candidate)).toBe(true);
          });
        });
      allTestEntries
        // eslint-disable-next-line no-unused-vars
        .filter(([_, spec]) => !spec.is_async_function)
        .forEach(([key, spec]) => {
          const candidate = getTestCandidateBySpecificationKey(key);
          test(`- ${spec.description} is **not** a kind of **non generator** async function.`, () => {
            expect(isAsyncFunction(candidate)).toBe(false);
          });
        });

      test('- an `Array` instance is **not** a kind of **non generator** async function.', () => {
        expect(isAsyncFunction([])).toBe(false);
      });
      test('- an `Object` instance is **not** a kind of **non generator** async function.', () => {
        expect(isAsyncFunction({})).toBe(false);
      });
    });
  });

  describe('The introspection method `isAsyncArrow` ...', () => {
    test('- filters the correct amount of items from a given array of mixed function types.', () => {
      expect(
        allTestEntries.filter(([key /* , spec */]) =>
          isAsyncArrow(getTestCandidateBySpecificationKey(key)),
        ).length,
      ).toBe(
        allTestEntries
          // eslint-disable-next-line no-unused-vars
          .filter(([_, spec]) => !!spec.is_async_arrow).length,
      );
    });

    describe('... verifies whether ...', () => {
      allTestEntries
        // eslint-disable-next-line no-unused-vars
        .filter(([_, spec]) => !!spec.is_async_arrow)
        .forEach(([key, spec]) => {
          const candidate = getTestCandidateBySpecificationKey(key);
          test(`- ${spec.description} is exclusively an async arrow function.`, () => {
            expect(isAsyncArrow(candidate)).toBe(true);
          });
        });
      allTestEntries
        // eslint-disable-next-line no-unused-vars
        .filter(([_, spec]) => !spec.is_async_arrow)
        .forEach(([key, spec]) => {
          const candidate = getTestCandidateBySpecificationKey(key);
          test(`- ${spec.description} is **not** exclusively an async arrow function.`, () => {
            expect(isAsyncArrow(candidate)).toBe(false);
          });
        });

      test('- an `Array` instance is **not** exclusively an async arrow function.', () => {
        expect(isAsyncArrow([])).toBe(false);
      });
      test('- an `Object` instance is **not** exclusively an async arrow function.', () => {
        expect(isAsyncArrow({})).toBe(false);
      });
    });
  });

  describe('The introspection method `isNonAsyncArrow` ...', () => {
    test('- filters the correct amount of items from a given array of mixed function types.', () => {
      expect(
        allTestEntries.filter(([key /* , spec */]) =>
          isNonAsyncArrow(getTestCandidateBySpecificationKey(key)),
        ).length,
      ).toBe(
        allTestEntries
          // eslint-disable-next-line no-unused-vars
          .filter(([_, spec]) => !!spec.is_non_async_arrow).length,
      );
    });

    describe('... verifies whether ...', () => {
      allTestEntries
        // eslint-disable-next-line no-unused-vars
        .filter(([_, spec]) => !!spec.is_non_async_arrow)
        .forEach(([key, spec]) => {
          const candidate = getTestCandidateBySpecificationKey(key);
          test(`- ${spec.description} is exclusively a non async arrow function.`, () => {
            expect(isNonAsyncArrow(candidate)).toBe(true);
          });
        });
      allTestEntries
        // eslint-disable-next-line no-unused-vars
        .filter(([_, spec]) => !spec.is_non_async_arrow)
        .forEach(([key, spec]) => {
          const candidate = getTestCandidateBySpecificationKey(key);
          test(`- ${spec.description} is **not** exclusively a non async arrow function.`, () => {
            expect(isNonAsyncArrow(candidate)).toBe(false);
          });
        });

      test('- an `Array` instance is **not** exclusively a non async arrow function.', () => {
        expect(isNonAsyncArrow([])).toBe(false);
      });
      test('- an `Object` instance is **not** exclusively a non async arrow function.', () => {
        expect(isNonAsyncArrow({})).toBe(false);
      });
    });
  });

  describe('The introspection method `isExtendedFunction` ...', () => {
    test('- filters the correct amount of items from a given array of mixed function types.', () => {
      expect(
        allTestEntries.filter(([key /* , spec */]) =>
          isExtendedFunction(getTestCandidateBySpecificationKey(key)),
        ).length,
      ).toBe(
        allTestEntries
          // eslint-disable-next-line no-unused-vars
          .filter(([_, spec]) => !!spec.is_extended_function).length,
      );
    });

    describe('... verifies whether ...', () => {
      allTestEntries
        // eslint-disable-next-line no-unused-vars
        .filter(([_, spec]) => !!spec.is_extended_function)
        .forEach(([key, spec]) => {
          const candidate = getTestCandidateBySpecificationKey(key);
          test(`- ${spec.description} is exclusively a \`Function\` subtype (an instance of a class which extends \`Function\`).`, () => {
            expect(isExtendedFunction(candidate)).toBe(true);
          });
        });
      allTestEntries
        // eslint-disable-next-line no-unused-vars
        .filter(([_, spec]) => !spec.is_extended_function)
        .forEach(([key, spec]) => {
          const candidate = getTestCandidateBySpecificationKey(key);
          test(`- ${spec.description} is **not** exclusively a \`Function\` subtype (an instance of a class which extends \`Function\`).`, () => {
            expect(isExtendedFunction(candidate)).toBe(false);
          });
        });

      test('- an `Array` instance is **not** exclusively a `Function` subtype (an instance of a class which extends `Function`).', () => {
        expect(isES3Function([])).toBe(false);
      });
      test('- an `Object` instance is **not** exclusively a `Function` subtype (an instance of a class which extends `Function`).', () => {
        expect(isES3Function({})).toBe(false);
      });
    });
  });

  describe('The introspection method `isES3Function` ...', () => {
    test('- filters the correct amount of items from a given array of mixed function types.', () => {
      expect(
        allTestEntries.filter(([key /* , spec */]) =>
          isES3Function(getTestCandidateBySpecificationKey(key)),
        ).length,
      ).toBe(
        allTestEntries
          // eslint-disable-next-line no-unused-vars
          .filter(([_, spec]) => !!spec.is_es3_function).length,
      );
    });

    describe('... verifies whether ...', () => {
      allTestEntries
        // eslint-disable-next-line no-unused-vars
        .filter(([_, spec]) => !!spec.is_es3_function)
        .forEach(([key, spec]) => {
          const candidate = getTestCandidateBySpecificationKey(key);
          test(`- ${spec.description} is exclusively the only known function type back at ES3 (in addition to all the built-in constructor functions).`, () => {
            expect(isES3Function(candidate)).toBe(true);
          });
        });
      allTestEntries
        // eslint-disable-next-line no-unused-vars
        .filter(([_, spec]) => !spec.is_es3_function)
        .forEach(([key, spec]) => {
          const candidate = getTestCandidateBySpecificationKey(key);
          test(`- ${spec.description} is **not** exclusively the only known function type back at ES3 (in addition to all the built-in constructor functions).`, () => {
            expect(isES3Function(candidate)).toBe(false);
          });
        });

      test('- an `Array` instance is **not** exclusively the only known function type back at ES3 (in addition to all the built-in constructor functions).', () => {
        expect(isES3Function([])).toBe(false);
      });
      test('- an `Object` instance is **not** exclusively the only known function type back at ES3 (in addition to all the built-in constructor functions).', () => {
        expect(isES3Function({})).toBe(false);
      });
    });
  });

  describe('The introspection method `isGenericFunction` ...', () => {
    test('- filters the correct amount of items from a given array of mixed function types.', () => {
      expect(
        allTestEntries.filter(([key /* , spec */]) =>
          isGenericFunction(getTestCandidateBySpecificationKey(key)),
        ).length,
      ).toBe(
        allTestEntries
          // eslint-disable-next-line no-unused-vars
          .filter(([_, spec]) => !!spec.is_generic_function).length,
      );
    });

    describe('... verifies whether ...', () => {
      allTestEntries
        // eslint-disable-next-line no-unused-vars
        .filter(([_, spec]) => !!spec.is_generic_function)
        .forEach(([key, spec]) => {
          const candidate = getTestCandidateBySpecificationKey(key);
          test(`- ${spec.description} is either a non async arrow function or a good old ES3 function.`, () => {
            expect(isGenericFunction(candidate)).toBe(true);
          });
        });
      allTestEntries
        // eslint-disable-next-line no-unused-vars
        .filter(([_, spec]) => !spec.is_generic_function)
        .forEach(([key, spec]) => {
          const candidate = getTestCandidateBySpecificationKey(key);
          test(`- ${spec.description} is **neither** a non async arrow function **nor** a good old ES3 function.`, () => {
            expect(isGenericFunction(candidate)).toBe(false);
          });
        });

      test('- an `Array` instance is **neither** a non async arrow function **nor** a good old ES3 function.', () => {
        expect(isGenericFunction([])).toBe(false);
      });
      test('- an `Object` instance is **neither** a non async arrow function **nor** a good old ES3 function.', () => {
        expect(isGenericFunction({})).toBe(false);
      });
    });
  });

  describe('The introspection method `isUnnamedFunction` ...', () => {
    test('- filters the correct amount of items from a given array of mixed function types.', () => {
      expect(
        allTestEntries.filter(([key /* , spec */]) =>
          isUnnamedFunction(getTestCandidateBySpecificationKey(key)),
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
        test(`- ${spec.description} is a unnamed function type.`, () => {
          expect(isUnnamedFunction(candidate)).toBe(true);
        });
      });

      [
        ...Object.entries(functions.named),
        ...Object.entries(classes.named),
        ...Object.entries(testIndex.specification.other),
      ].forEach(([key, spec]) => {
        const candidate = getTestCandidateBySpecificationKey(key);
        test(`- ${spec.description} is **not** a unnamed function type.`, () => {
          expect(isUnnamedFunction(candidate)).toBe(false);
        });
      });

      test('- an `Array` instance is **not** a unnamed function type.', () => {
        expect(isUnnamedFunction([])).toBe(false);
      });
      test('- an `Object` instance is **not** a unnamed function type.', () => {
        expect(isUnnamedFunction({})).toBe(false);
      });
    });
  });
});
