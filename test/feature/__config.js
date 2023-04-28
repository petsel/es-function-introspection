// eslint-disable-next-line max-classes-per-file
import { isFunction } from '../../src/feature/isFunction';

// eslint-disable-next-line no-empty-function
async function asyncFunctionStatement() {}

// eslint-disable-next-line no-empty-function
async function* asyncGeneratorStatement() {}

// eslint-disable-next-line no-empty-function
function* generatorStatement() {}

function functionStatement() {}

class ClassExpression {}

// custom function subtype/class.
class Applicator extends Function {
  // eslint-disable-next-line no-useless-constructor
  constructor(...args) {
    super(...args);
  }
}
// - constructable and callable instance of the
//   custom `Applicator` function subtype/class.
const applicator = new Applicator();

export const testIndex = {
  specification: {
    function: {
      named: {
        namedArrowFunctionExpression: {
          description: 'a named arrow function expression',
          callable: true,
          constructable: false,
          constructableWithNew: false,
          constructableWithoutNew: false,
          has_no_construct_slot: true,
          is_generic_function: true,
          is_arrow_type: true,
          is_non_async_arrow: true,
        },
        namedAsyncArrowFunctionExpression: {
          description: 'a named async arrow function expression',
          callable: true,
          constructable: false,
          constructableWithNew: false,
          constructableWithoutNew: false,
          has_no_construct_slot: true,
          is_arrow_type: true,
          is_async_type: true,
          is_async_function: true,
          is_async_arrow: true,
        },
        namedAsyncFunctionExpression: {
          description: 'a named async function expression',
          callable: true,
          constructable: false,
          constructableWithNew: false,
          constructableWithoutNew: false,
          has_no_construct_slot: true,
          is_async_type: true,
          is_async_function: true,
        },
        asyncFunctionStatement: {
          description: 'an async function statement',
          callable: true,
          constructable: false,
          constructableWithNew: false,
          constructableWithoutNew: false,
          has_no_construct_slot: true,
          is_async_type: true,
          is_async_function: true,
        },

        namedAsyncGeneratorExpression: {
          description: 'a named async generator expression',
          callable: true,
          // despite the [[construct]] slot indicating the `false` value
          constructable: true,
          constructableWithNew: false,
          // despite the [[construct]] slot indicating the `false` value
          constructableWithoutNew: true,
          has_no_construct_slot: true,
          is_generator_type: true,
          is_async_type: true,
          is_async_generator: true,
          has_writable_prototype: true,
        },
        asyncGeneratorStatement: {
          description: 'an async generator statement',
          callable: true,
          // despite the [[construct]] slot indicating the `false` value
          constructable: true,
          constructableWithNew: false,
          // despite the [[construct]] slot indicating the `false` value
          constructableWithoutNew: true,
          has_no_construct_slot: true,
          is_generator_type: true,
          is_async_type: true,
          is_async_generator: true,
          has_writable_prototype: true,
        },
        namedGeneratorExpression: {
          description: 'a named generator expression',
          callable: true,
          // despite the [[construct]] slot indicating the `false` value
          constructable: true,
          constructableWithNew: false,
          // despite the [[construct]] slot indicating the `false` value
          constructableWithoutNew: true,
          has_no_construct_slot: true,
          is_generator_type: true,
          is_generator_function: true,
          has_writable_prototype: true,
        },
        generatorStatement: {
          description: 'a generator statement',
          callable: true,
          // despite the [[construct]] slot indicating the `false` value
          constructable: true,
          constructableWithNew: false,
          // despite the [[construct]] slot indicating the `false` value
          constructableWithoutNew: true,
          has_no_construct_slot: true,
          is_generator_type: true,
          is_generator_function: true,
          has_writable_prototype: true,
        },

        namedFunctionExpression: {
          description: 'a named function expression',
          callable: true,
          constructable: true,
          constructableWithNew: true,
          constructableWithoutNew: false,
          is_generic_function: true,
          is_es3_function: true,
          has_writable_prototype: true,
        },
        functionStatement: {
          description: 'a function statement',
          callable: true,
          constructable: true,
          constructableWithNew: true,
          constructableWithoutNew: false,
          is_generic_function: true,
          is_es3_function: true,
          has_writable_prototype: true,
        },

        applicator: {
          description:
            'an instance of a custom `Applicator` class which extends `Function`',
          // - due to any `Applicator` instance inheriting from `Function` as well.
          callable: true,
          // - due to any `Applicator` instance inheriting from `Function` as well.
          constructable: true,
          // - due to any `Applicator` instance inheriting from `Function` as well.
          constructableWithNew: true,
          // - due to any `Applicator` instance inheriting from `Function` as well.
          constructableWithoutNew: false,
          is_extended_function: true,
          has_writable_prototype: true,
          function_name: 'anonymous',
        },
      },
      unnamed: {
        unnamedArrowFunctionExpression: {
          description: 'an unnamed arrow function (lambda) expression',
          callable: true,
          constructable: false,
          constructableWithNew: false,
          constructableWithoutNew: false,
          has_no_construct_slot: true,
          is_generic_function: true,
          is_arrow_type: true,
          is_non_async_arrow: true,
        },
        unnamedAsyncArrowFunctionExpression: {
          description: 'an unnamed async arrow function (lambda) expression',
          callable: true,
          constructable: false,
          constructableWithNew: false,
          constructableWithoutNew: false,
          has_no_construct_slot: true,
          is_arrow_type: true,
          is_async_type: true,
          is_async_function: true,
          is_async_arrow: true,
        },
        unnamedAsyncFunctionExpression: {
          description: 'an unnamed async function (lambda) expression',
          callable: true,
          constructable: false,
          constructableWithNew: false,
          constructableWithoutNew: false,
          has_no_construct_slot: true,
          is_async_type: true,
          is_async_function: true,
        },

        unnamedAsyncGeneratorExpression: {
          description: 'an unnamed async generator (lambda) expression',
          callable: true,
          // despite the [[construct]] slot indicating the `false` value
          constructable: true,
          constructableWithNew: false,
          // despite the [[construct]] slot indicating the `false` value
          constructableWithoutNew: true,
          has_no_construct_slot: true,
          is_generator_type: true,
          is_async_type: true,
          is_async_generator: true,
          has_writable_prototype: true,
        },
        unnamedGeneratorExpression: {
          description: 'an unnamed generator (lambda) expression',
          callable: true,
          // despite the [[construct]] slot indicating the `false` value
          constructable: true,
          constructableWithNew: false,
          // despite the [[construct]] slot indicating the `false` value
          constructableWithoutNew: true,
          has_no_construct_slot: true,
          is_generator_type: true,
          is_generator_function: true,
          has_writable_prototype: true,
        },

        unnamedFunctionExpression: {
          description: 'an unnamed function (lambda) expression',
          bound: {
            callable: {
              throws: RangeError,
            },
          },
          callable: true,
          constructable: true,
          constructableWithNew: true,
          constructableWithoutNew: false,
          is_generic_function: true,
          is_es3_function: true,
          has_writable_prototype: true,
          can_not_be_distinctively_bound: true,
        },
      },
    },
    class: {
      named: {
        Applicator: {
          description: 'a custom `Applicator` class which extends `Function`',
          callable: false,
          constructable: true,
          constructableWithNew: true,
          constructableWithoutNew: false,
          is_class: true,
        },
        ClassExpression: {
          description: 'a named class expression',
          callable: false,
          constructable: true,
          constructableWithNew: true,
          constructableWithoutNew: false,
          is_class: true,
        },
      },
      unnamed: {
        UnnamedClassExpression: {
          description: 'an unnamed class expression',
          bound: {
            callable: {
              throws: RangeError,
            },
          },
          callable: false,
          constructable: true,
          constructableWithNew: true,
          constructableWithoutNew: false,
          is_class: true,
          can_not_be_distinctively_bound: true,
        },
        UnnamedExtendedClassExpression: {
          description: 'an unnamed extended class expression',
          bound: {
            callable: {
              throws: RangeError,
            },
          },
          callable: false,
          constructable: true,
          constructableWithNew: true,
          constructableWithoutNew: false,
          is_class: true,
          can_not_be_distinctively_bound: true,
        },
      },
    },
    other: {
      EventTarget: {
        description: 'the Web API `EventTarget` type',
        callable: false,
        constructable: true,
        constructableWithNew: true,
        constructableWithoutNew: false,
      },
      URL: {
        description: 'the Web API `URL` type',
        args: ['http://xyz.ab'],
        callable: false,
        constructable: true,
        constructableWithNew: true,
        constructableWithoutNew: false,
      },

      // BigInt: {
      //   description: 'the built-in `BigInt` type',
      //   callable: true,
      //   constructable: true,
      //   constructableWithNew: false,
      //   constructableWithoutNew: true,
      // },
      // Symbol: {
      //   description: 'the built-in `Symbol` type',
      //   callable: true,
      //   constructable: true,
      //   constructableWithNew: false,
      //   constructableWithoutNew: true,
      // },
      //
      // String: {
      //   description: 'the built-in `String` type',
      //   callable: true,
      //   constructable: true,
      //   constructableWithNew: true,
      //   constructableWithoutNew: false,
      // },
      // Array: {
      //   description: 'the built-in `Object` type',
      //   callable: true,
      //   constructable: true,
      //   constructableWithNew: true,
      //   constructableWithoutNew: true,
      // },
    },
  },
  candidate: {
    namedArrowFunctionExpression: _ => _,
    namedAsyncArrowFunctionExpression: async _ => _,
    namedAsyncFunctionExpression:
      // eslint-disable-next-line no-empty-function
      async function namedAsyncFunctionExpression() {},
    namedAsyncGeneratorExpression:
      // eslint-disable-next-line no-empty-function
      async function* namedAsyncGeneratorExpression() {},
    // eslint-disable-next-line no-empty-function
    namedGeneratorExpression: function* namedGeneratorExpression() {},
    namedFunctionExpression: function namedFunctionExpression() {},

    asyncFunctionStatement,
    asyncGeneratorStatement,
    generatorStatement,
    functionStatement,

    ClassExpression,
    Applicator,

    applicator,

    // URL: globalThis.URL,
    // EventTarget: globalThis.EventTarget,
  },
};

// eslint-disable-next-line consistent-return
export function getTestCandidateBySpecificationKey(key) {
  const candidate = testIndex.candidate[key];
  if (isFunction(candidate)) {
    return candidate;
  }
  if (key === 'unnamedArrowFunctionExpression') {
    return _ => _;
  }
  if (key === 'unnamedAsyncArrowFunctionExpression') {
    return async _ => _;
  }
  if (key === 'unnamedAsyncFunctionExpression') {
    // eslint-disable-next-line func-names, no-empty-function
    return async function () {};
  }
  if (key === 'unnamedAsyncGeneratorExpression') {
    // eslint-disable-next-line func-names, no-empty-function
    return async function* () {};
  }
  if (key === 'unnamedGeneratorExpression') {
    // eslint-disable-next-line func-names, no-empty-function
    return function* () {};
  }
  if (key === 'unnamedFunctionExpression') {
    // eslint-disable-next-line func-names
    return function () {};
  }
  if (key === 'UnnamedClassExpression') {
    return class {};
  }
  if (key === 'UnnamedExtendedClassExpression') {
    return class extends Array {};
  }
  return globalThis[key];
}
