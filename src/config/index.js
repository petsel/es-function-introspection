export const alwaysInstantiatingBuiltInConstructors = new Set([
  Function,
  Object,
  Array,
  RegExp,
  Error,
  AggregateError,
  EvalError,
  RangeError,
  ReferenceError,
  SyntaxError,
  TypeError,
  URIError,
]);
export const typeCoercionBuiltInConstructors = new Set([
  Boolean,
  Number,
  String,
  Date,
  Object,
]);
export const exclusivelyNewableBuiltInConstructors = new Set([Proxy, Map, Set]);
export const exclusivelyNonNewableBuiltInConstructors = new Set([
  Symbol,
  BigInt,
]);

export const withoutNewInstantiatingBuiltInConstructors = new Set([
  ...alwaysInstantiatingBuiltInConstructors,
  ...exclusivelyNonNewableBuiltInConstructors,
]);
export const callableBuiltInConstructors = new Set([
  ...alwaysInstantiatingBuiltInConstructors,
  ...typeCoercionBuiltInConstructors,
  ...exclusivelyNonNewableBuiltInConstructors,
]);
