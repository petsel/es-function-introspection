/* eslint-disable max-classes-per-file */
import { describe, expect, test } from '@jest/globals';

import {
  testIndex,
  getTestCandidateBySpecificationKey,
} from './feature/__config';

import {
  hasWritablePrototype,
  getFunctionName,
  getUnboundName,
  getFunctionSignature,
  getInternalTypeSignature,
  getInternalTypeName,
} from '../src/utility';

describe('Regarding all test functionality of the `utility` module ...', () => {
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

  describe('The utility method `hasWritablePrototype` verifies whether ...', () => {
    allTestEntries
      // eslint-disable-next-line no-unused-vars
      .filter(([_, spec]) => !!spec.has_writable_prototype)
      .forEach(([key, spec]) => {
        const candidate = getTestCandidateBySpecificationKey(key);
        test(`- ${spec.description} features a truly \`writable\` \`prototype\` property.`, () => {
          expect(hasWritablePrototype(candidate)).toBe(true);
        });
      });
    allTestEntries
      // eslint-disable-next-line no-unused-vars
      .filter(([_, spec]) => !spec.has_writable_prototype)
      .forEach(([key, spec]) => {
        const candidate = getTestCandidateBySpecificationKey(key);
        test(`- ${spec.description} does **not** feature a truly \`writable\` \`prototype\` property.`, () => {
          expect(hasWritablePrototype(candidate)).toBe(false);
        });
      });
  });

  describe('The utility method `getFunctionName` returns ...', () => {
    [
      ...Object.entries(functions.named),
      ...Object.entries(classes.named),
      ...Object.entries(testIndex.specification.other),
    ].forEach(([key, spec]) => {
      const fctName = spec.function_name ?? key;
      const candidate = getTestCandidateBySpecificationKey(key);
      test(`- the string value "${fctName}" for ${spec.description}.`, () => {
        expect(getFunctionName(candidate)).toBe(fctName);
      });
    });

    [
      ...Object.entries(functions.unnamed),
      ...Object.entries(classes.unnamed),
    ].forEach(([key, spec]) => {
      const candidate = getTestCandidateBySpecificationKey(key);
      test(`- an empty string value for ${spec.description}.`, () => {
        expect(getFunctionName(candidate)).toBe('');
      });
    });

    test('- the correct function name of renamed function types as well.', () => {
      const toBeRenamed = function foo(bar) {
        return bar;
      };
      expect(getFunctionName(toBeRenamed)).toBe('foo');

      // handling a renamed function.
      Object.defineProperty(toBeRenamed, 'name', { value: 'bar' });
      expect(getFunctionName(toBeRenamed)).toBe('bar');

      // handling a renamed function.
      Object.defineProperty(toBeRenamed, 'name', { value: '' });
      expect(getFunctionName(toBeRenamed)).toBe('');
    });
  });

  describe('The utility method `getUnboundName` returns ...', () => {
    [
      ...Object.entries(functions.named),
      ...Object.entries(classes.named),
      ...Object.entries(testIndex.specification.other),
    ].forEach(([key, spec]) => {
      const fctName = spec.function_name ?? key;
      const candidate = getTestCandidateBySpecificationKey(key);
      test(`- the string value "${fctName}" for the **multiple bound** variant of ${spec.description}.`, () => {
        expect(
          getUnboundName(getFunctionName(candidate.bind().bind().bind())),
        ).toBe(fctName);
      });
    });

    [
      ...Object.entries(functions.unnamed),
      ...Object.entries(classes.unnamed),
    ].forEach(([key, spec]) => {
      const candidate = getTestCandidateBySpecificationKey(key);
      test(`- an empty string value for the **single bound** variant of ${spec.description}.`, () => {
        expect(getUnboundName(getFunctionName(candidate.bind()))).toBe('');
      });
    });
  });

  function functionStatement(foo) {
    return foo;
  }
  const namedFunctionExpression = function foo(bar) {
    return bar;
  };
  // eslint-disable-next-line func-names
  const notAnonymousFunctionExpression = function (baz) {
    return baz;
  };
  const notAnonymousArrowFunction = biz => biz;

  class ClassExpression {}

  /* eslint-disable no-empty-function */
  function* generatorStatement() {}
  async function asyncFunctionStatement() {}
  /* eslint-enable */

  describe('The utility method `getFunctionSignature` ...', () => {
    test("- does extract any function type's `toString` representative.", () => {
      expect(getFunctionSignature(functionStatement)).toMatchSnapshot();
      expect(getFunctionSignature(namedFunctionExpression)).toMatchSnapshot();
      expect(
        getFunctionSignature(notAnonymousFunctionExpression),
      ).toMatchSnapshot();
      expect(getFunctionSignature(notAnonymousArrowFunction)).toMatchSnapshot();

      // truly anonymous and empty functions.

      /* eslint-disable prefer-arrow-callback, func-names, no-empty-function */
      expect(getFunctionSignature(function () {})).toMatchSnapshot();
      expect(getFunctionSignature(() => ({}))).toMatchSnapshot();
      expect(getFunctionSignature(class {})).toMatchSnapshot();
      expect(getFunctionSignature(function* () {})).toMatchSnapshot();
      /* eslint-enable */
    });
  });

  describe('The utility method `getInternalTypeSignature` ...', () => {
    test("- does extract any object's internal type/class signature.", () => {
      expect(getInternalTypeSignature(undefined)).toBe('[object Undefined]');
      expect(getInternalTypeSignature(null)).toBe('[object Null]');

      expect(getInternalTypeSignature(true)).toBe('[object Boolean]');
      expect(getInternalTypeSignature(123)).toBe('[object Number]');
      expect(getInternalTypeSignature('')).toBe('[object String]');

      expect(getInternalTypeSignature(Symbol('symbol'))).toBe(
        '[object Symbol]',
      );

      expect(getInternalTypeSignature(new Date())).toBe('[object Date]');
      expect(getInternalTypeSignature(RegExp())).toBe('[object RegExp]');

      expect(getInternalTypeSignature({})).toBe('[object Object]');
      expect(getInternalTypeSignature([])).toBe('[object Array]');

      expect(getInternalTypeSignature(ClassExpression)).toBe(
        '[object Function]',
      );

      expect(getInternalTypeSignature(notAnonymousArrowFunction)).toBe(
        '[object Function]',
      );
      expect(getInternalTypeSignature(functionStatement)).toBe(
        '[object Function]',
      );

      expect(getInternalTypeSignature(asyncFunctionStatement)).toBe(
        '[object AsyncFunction]',
      );
      expect(getInternalTypeSignature(generatorStatement)).toBe(
        '[object GeneratorFunction]',
      );
      // eslint-disable-next-line func-names, no-empty-function
      expect(getInternalTypeSignature(async function* () {})).toBe(
        '[object AsyncGeneratorFunction]',
      );

      expect(getInternalTypeSignature(new Error(''))).toBe('[object Error]');

      // exceptions
      expect(getInternalTypeSignature(new SyntaxError(''))).not.toBe(
        '[object SyntaxError]',
      );
      expect(getInternalTypeSignature(new SyntaxError(''))).toBe(
        '[object Error]',
      );

      expect(getInternalTypeSignature(new ClassExpression())).not.toBe(
        '[object ClassExpression]',
      );
      expect(getInternalTypeSignature(new ClassExpression())).toBe(
        '[object Object]',
      );
    });
  });

  describe('The utility method `getInternalTypeName` ...', () => {
    test("- does extract any object's internal type/constructor name.", () => {
      expect(getInternalTypeName('foo')).toBe('String');

      expect(getInternalTypeName(undefined)).toBe('Undefined');
      expect(getInternalTypeName(null)).toBe('Null');

      expect(getInternalTypeName(true)).toBe('Boolean');
      expect(getInternalTypeName(123)).toBe('Number');
      expect(getInternalTypeName('')).toBe('String');

      expect(getInternalTypeName(Symbol('symbol'))).toBe('Symbol');

      expect(getInternalTypeName(new Date())).toBe('Date');
      expect(getInternalTypeName(RegExp())).toBe('RegExp');

      expect(getInternalTypeName({})).toBe('Object');
      expect(getInternalTypeName([])).toBe('Array');

      expect(getInternalTypeName(ClassExpression)).toBe('Function');

      expect(getInternalTypeName(notAnonymousArrowFunction)).toBe('Function');
      expect(getInternalTypeName(functionStatement)).toBe('Function');

      expect(getInternalTypeName(asyncFunctionStatement)).toBe('AsyncFunction');
      expect(getInternalTypeName(generatorStatement)).toBe('GeneratorFunction');
      // eslint-disable-next-line func-names, no-empty-function
      expect(getInternalTypeName(async function* () {})).toBe(
        'AsyncGeneratorFunction',
      );

      expect(getInternalTypeName(new Error(''))).toBe('Error');

      // introspection function's first approach exceptions handled well by its second approach.
      expect(getInternalTypeName(new SyntaxError(''))).toBe('SyntaxError');
      expect(getInternalTypeName(new SyntaxError(''))).not.toBe('Error');

      expect(getInternalTypeName(new ClassExpression())).toBe(
        'ClassExpression',
      );
      expect(getInternalTypeName(new ClassExpression())).not.toBe('Object');
    });
  });
});
