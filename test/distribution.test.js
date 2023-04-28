/* eslint-disable max-classes-per-file */
import { describe, expect, test } from '@jest/globals';

import distribution from '../src';

const { augmentFunctionNamespace, restoreFunctionDefault, ...introspections } =
  distribution;

describe('Regarding all the available distribution functionality ...', () => {
  describe("The distribution's namespace ...", () => {
    const introspectionNameList = Reflect.ownKeys(introspections);

    test(`- should feature ${
      introspectionNameList.length
    } \`Function\` related introspection methods, which are ... ${introspectionNameList
      .map(name => `\`${name}\``)
      .join(', ')}.`, () => {
      expect(introspectionNameList.length).toStrictEqual(22);
    });

    describe('- should feature ...', () => {
      test('... two additional methods ...', () => {
        expect(
          Reflect.ownKeys(distribution).length - introspectionNameList.length,
        ).toStrictEqual(2);
      });
      describe('- `augmentFunctionNamespace` ...', () => {
        test("... which assigns any of the distribution's introspection functionality to the global `Function` namespace.", () => {
          augmentFunctionNamespace();
          expect(
            Object.entries(introspections).every(
              ([key, value]) => Function[key] === value,
            ),
          ).toBe(true);
        });
      });
      describe('- `restoreFunctionDefault` ...', () => {
        test("... which restores the global `Function` namespace by deleting any of the distribution's introspection functionality from the former.", () => {
          restoreFunctionDefault();
          expect(
            Object.keys(introspections)
              // eslint-disable-next-line no-prototype-builtins
              .every(key => !Function.hasOwnProperty(key)),
          ).toBe(true);
        });
      });
    });
  });
});
