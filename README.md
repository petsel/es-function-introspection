# ECMAScript function introspection

Static introspection methods which detect ECMAScript function
types and/or check for a function's behavior and capabilities.

The distribution's namespace feature 22 `Function` related
introspection methods, which are ...

 - `isFunction`,
 - `isClass`,
 - `isArrowType`,
 - `isGeneratorType`,
 - `isAsyncType`,
 - `isAsyncGenerator`,
 - `isGeneratorFunction`,
 - `isAsyncFunction`,
 - `isAsyncArrow`,
 - `isNonAsyncArrow`,
 - `isExtendedFunction`,
 - `isES3Function`,
 - `isGenericFunction`,
 - `isUnnamedFunction`,
 - `isConstructable`,
 - `isConstructableWithNew`,
 - `isConstructableWithoutNew`,
 - `isCallable`,
 - `isBound`,
 - `isBoundUnnamed`,
 - `hasBoundCallFuzziness`,
 - `canBeBoundDistinctively`.

The namespace in addition features the two additional methods
`augmentFunctionNamespace` and `restoreFunctionDefault` with
the former assigning any of the distribution's introspection
functionality to the global `Function` namespace and the latter
restoring the global `Function` namespace to its default again.
