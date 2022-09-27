/**
 * Immutable data encourages pure functions (data-in, data-out) and lends itself
 * to much simpler application development and enabling techniques from
 * functional programming such as lazy evaluation.
 *
 * While designed to bring these powerful functional concepts to JavaScript, it
 * presents an Object-Oriented API familiar to Javascript engineers and closely
 * mirroring that of Array, Map, and Set. It is easy and efficient to convert to
 * and from plain Javascript types.
 *
 * ## How to read these docs
 *
 * In order to better explain what kinds of values the Immutable.js API expects
 * and produces, this documentation is presented in a statically typed dialect of
 * JavaScript (like [Flow][] or [TypeScript][]). You *don't need* to use these
 * type checking tools in order to use Immutable.js, however becoming familiar
 * with their syntax will help you get a deeper understanding of this API.
 *
 * **A few examples and how to read them.**
 *
 * All methods describe the kinds of data they accept and the kinds of data
 * they return. For example a function which accepts two numbers and returns
 * a number would look like this:
 *
 * ```js
 * sum(first: number, second: number): number
 * ```
 *
 * Sometimes, methods can accept different kinds of data or return different
 * kinds of data, and this is described with a *type variable*, which is
 * typically in all-caps. For example, a function which always returns the same
 * kind of data it was provided would look like this:
 *
 * ```js
 * identity<T>(value: T): T
 * ```
 *
 * Type variables are defined with classes and referred to in methods. For
 * example, a class that holds onto a value for you might look like this:
 *
 * ```js
 * class Box<T> {
 *   constructor(value: T)
 *   getValue(): T
 * }
 * ```
 *
 * In order to manipulate Immutable data, methods that we're used to affecting
 * a Collection instead return a new Collection of the same type. The type
 * `this` refers to the same kind of class. For example, a List which returns
 * new Lists when you `push` a value onto it might look like:
 *
 * ```js
 * class List<T> {
 *   push(value: T): this
 * }
 * ```
 *
 * Many methods in Immutable.js accept values which implement the JavaScript
 * [Iterable][] protocol, and might appear like `Iterable<string>` for something
 * which represents sequence of strings. Typically in JavaScript we use plain
 * Arrays (`[]`) when an Iterable is expected, but also all of the Immutable.js
 * collections are iterable themselves!
 *
 * For example, to get a value deep within a structure of data, we might use
 * `getIn` which expects an `Iterable` path:
 *
 * ```
 * getIn(path: Iterable<string | number>): unknown
 * ```
 *
 * To use this method, we could pass an array: `data.getIn([ "key", 2 ])`.
 *
 *
 * Note: All examples are presented in the modern [ES2015][] version of
 * JavaScript. Use tools like Babel to support older browsers.
 *
 * For example:
 *
 * ```js
 * // ES2015
 * const mappedFoo = foo.map(x => x * x);
 * // ES5
 * var mappedFoo = foo.map(function (x) { return x * x; });
 * ```
 *
 * [ES2015]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/New_in_JavaScript/ECMAScript_6_support_in_Mozilla
 * [TypeScript]: https://www.typescriptlang.org/
 * [Flow]: https://flowtype.org/
 * [Iterable]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols
 */

/**
 * Immutable Map is an unordered Collection.Keyed of (key, value) pairs with
 * `O(log32 N)` gets and `O(log32 N)` persistent sets.
 *
 * Iteration order of a Map is undefined, however is stable. Multiple
 * iterations of the same Map will iterate in the same order.
 *
 * Map's keys can be of any type, and use `Immutable.is` to determine key
 * equality. This allows the use of any value (including NaN) as a key.
 *
 * Because `Immutable.is` returns equality based on value semantics, and
 * Immutable collections are treated as values, any Immutable collection may
 * be used as a key.
 *
 * <!-- runkit:activate -->
 * ```js
 * const { Map, List } = require('immutable');
 * Map().set(List([ 1 ]), 'listofone').get(List([ 1 ]));
 * // 'listofone'
 * ```
 *
 * Any JavaScript object may be used as a key, however strict identity is used
 * to evaluate key equality. Two similar looking objects will represent two
 * different keys.
 *
 * Implemented by a hash-array mapped trie.
 */
declare namespace Map {
  /**
   * True if the provided value is a Map
   *
   * <!-- runkit:activate -->
   * ```js
   * const { Map } = require('immutable')
   * Map.isMap({}) // false
   * Map.isMap(Map()) // true
   * ```
   */
  function isMap(maybeMap: unknown): maybeMap is Map<unknown, unknown>;

  /**
   * Creates a new Map from alternating keys and values
   *
   * <!-- runkit:activate -->
   * ```js
   * const { Map } = require('immutable')
   * Map.of(
   *   'key', 'value',
   *   'numerical value', 3,
   *    0, 'numerical key'
   * )
   * // Map { 0: "numerical key", "key": "value", "numerical value": 3 }
   * ```
   *
   * @deprecated Use Map([ [ 'k', 'v' ] ]) or Map({ k: 'v' })
   */
  function of(...keyValues: Array<unknown>): Map<unknown, unknown>;
}

/**
 * Creates a new Immutable Map.
 *
 * Created with the same key value pairs as the provided Collection.Keyed or
 * JavaScript Object or expects a Collection of [K, V] tuple entries.
 *
 * Note: `Map` is a factory function and not a class, and does not use the
 * `new` keyword during construction.
 *
 * <!-- runkit:activate -->
 * ```js
 * const { Map } = require('immutable')
 * Map({ key: "value" })
 * Map([ [ "key", "value" ] ])
 * ```
 *
 * Keep in mind, when using JS objects to construct Immutable Maps, that
 * JavaScript Object properties are always strings, even if written in a
 * quote-less shorthand, while Immutable Maps accept keys of any type.
 *
 * <!-- runkit:activate
 *      { "preamble": "const { Map } = require('immutable');" }
 * -->
 * ```js
 * let obj = { 1: "one" }
 * Object.keys(obj) // [ "1" ]
 * assert.equal(obj["1"], obj[1]) // "one" === "one"
 *
 * let map = Map(obj)
 * assert.notEqual(map.get("1"), map.get(1)) // "one" !== undefined
 * ```
 *
 * Property access for JavaScript Objects first converts the key to a string,
 * but since Immutable Map keys can be of any type the argument to `get()` is
 * not altered.
 */
function Map<K, V>(collection?: Iterable<[K, V]>): Map<K, V>;
function Map<V>(obj: { [key: string]: V }): Map<string, V>;
function Map<K extends string | symbol, V>(obj: { [P in K]?: V }): Map<K, V>;

interface Map<K, V> extends Collection.Keyed<K, V> {
  /**
   * The number of entries in this Map.
   */
  readonly size: number;

  // Persistent changes

  /**
   * Returns a new Map also containing the new key, value pair. If an equivalent
   * key already exists in this Map, it will be replaced.
   *
   * <!-- runkit:activate -->
   * ```js
   * const { Map } = require('immutable')
   * const originalMap = Map()
   * const newerMap = originalMap.set('key', 'value')
   * const newestMap = newerMap.set('key', 'newer value')
   *
   * originalMap
   * // Map {}
   * newerMap
   * // Map { "key": "value" }
   * newestMap
   * // Map { "key": "newer value" }
   * ```
   *
   * Note: `set` can be used in `withMutations`.
   */
  set(key: K, value: V): this;

  /**
   * Returns a new Map which excludes this `key`.
   *
   * Note: `delete` cannot be safely used in IE8, but is provided to mirror
   * the ES6 collection API.
   *
   * <!-- runkit:activate -->
   * ```js
   * const { Map } = require('immutable')
   * const originalMap = Map({
   *   key: 'value',
   *   otherKey: 'other value'
   * })
   * // Map { "key": "value", "otherKey": "other value" }
   * originalMap.delete('otherKey')
   * // Map { "key": "value" }
   * ```
   *
   * Note: `delete` can be used in `withMutations`.
   *
   * @alias remove
   */
  delete(key: K): this;
  remove(key: K): this;

  /**
   * Returns a new Map which excludes the provided `keys`.
   *
   * <!-- runkit:activate -->
   * ```js
   * const { Map } = require('immutable')
   * const names = Map({ a: "Aaron", b: "Barry", c: "Connor" })
   * names.deleteAll([ 'a', 'c' ])
   * // Map { "b": "Barry" }
   * ```
   *
   * Note: `deleteAll` can be used in `withMutations`.
   *
   * @alias removeAll
   */
  deleteAll(keys: Iterable<K>): this;
  removeAll(keys: Iterable<K>): this;

  /**
   * Returns a new Map containing no keys or values.
   *
   * <!-- runkit:activate -->
   * ```js
   * const { Map } = require('immutable')
   * Map({ key: 'value' }).clear()
   * // Map {}
   * ```
   *
   * Note: `clear` can be used in `withMutations`.
   */
  clear(): this;

  /**
   * Returns a new Map having updated the value at this `key` with the return
   * value of calling `updater` with the existing value.
   *
   * Similar to: `map.set(key, updater(map.get(key)))`.
   *
   * <!-- runkit:activate -->
   * ```js
   * const { Map } = require('immutable')
   * const aMap = Map({ key: 'value' })
   * const newMap = aMap.update('key', value => value + value)
   * // Map { "key": "valuevalue" }
   * ```
   *
   * This is most commonly used to call methods on collections within a
   * structure of data. For example, in order to `.push()` onto a nested `List`,
   * `update` and `push` can be used together:
   *
   * <!-- runkit:activate
   *      { "preamble": "const { Map, List } = require('immutable');" }
   * -->
   * ```js
   * const aMap = Map({ nestedList: List([ 1, 2, 3 ]) })
   * const newMap = aMap.update('nestedList', list => list.push(4))
   * // Map { "nestedList": List [ 1, 2, 3, 4 ] }
   * ```
   *
   * When a `notSetValue` is provided, it is provided to the `updater`
   * function when the value at the key does not exist in the Map.
   *
   * <!-- runkit:activate
   *      { "preamble": "const { Map } = require('immutable');" }
   * -->
   * ```js
   * const aMap = Map({ key: 'value' })
   * const newMap = aMap.update('noKey', 'no value', value => value + value)
   * // Map { "key": "value", "noKey": "no valueno value" }
   * ```
   *
   * However, if the `updater` function returns the same value it was called
   * with, then no change will occur. This is still true if `notSetValue`
   * is provided.
   *
   * <!-- runkit:activate
   *      { "preamble": "const { Map } = require('immutable');" }
   * -->
   * ```js
   * const aMap = Map({ apples: 10 })
   * const newMap = aMap.update('oranges', 0, val => val)
   * // Map { "apples": 10 }
   * assert.strictEqual(newMap, map);
   * ```
   *
   * For code using ES2015 or later, using `notSetValue` is discourged in
   * favor of function parameter default values. This helps to avoid any
   * potential confusion with identify functions as described above.
   *
   * The previous example behaves differently when written with default values:
   *
   * <!-- runkit:activate
   *      { "preamble": "const { Map } = require('immutable');" }
   * -->
   * ```js
   * const aMap = Map({ apples: 10 })
   * const newMap = aMap.update('oranges', (val = 0) => val)
   * // Map { "apples": 10, "oranges": 0 }
   * ```
   *
   * If no key is provided, then the `updater` function return value is
   * returned as well.
   *
   * <!-- runkit:activate
   *      { "preamble": "const { Map } = require('immutable');" }
   * -->
   * ```js
   * const aMap = Map({ key: 'value' })
   * const result = aMap.update(aMap => aMap.get('key'))
   * // "value"
   * ```
   *
   * This can be very useful as a way to "chain" a normal function into a
   * sequence of methods. RxJS calls this "let" and lodash calls it "thru".
   *
   * For example, to sum the values in a Map
   *
   * <!-- runkit:activate
   *      { "preamble": "const { Map } = require('immutable');" }
   * -->
   * ```js
   * function sum(collection) {
   *   return collection.reduce((sum, x) => sum + x, 0)
   * }
   *
   * Map({ x: 1, y: 2, z: 3 })
   *   .map(x => x + 1)
   *   .filter(x => x % 2 === 0)
   *   .update(sum)
   * // 6
   * ```
   *
   * Note: `update(key)` can be used in `withMutations`.
   */
  update(key: K, notSetValue: V, updater: (value: V) => V): this;
  update(key: K, updater: (value: V | undefined) => V): this;
  update<R>(updater: (value: this) => R): R;

  /**
   * Returns a new Map resulting from merging the provided Collections
   * (or JS objects) into this Map. In other words, this takes each entry of
   * each collection and sets it on this Map.
   *
   * Note: Values provided to `merge` are shallowly converted before being
   * merged. No nested values are altered.
   *
   * <!-- runkit:activate -->
   * ```js
   * const { Map } = require('immutable')
   * const one = Map({ a: 10, b: 20, c: 30 })
   * const two = Map({ b: 40, a: 50, d: 60 })
   * one.merge(two) // Map { "a": 50, "b": 40, "c": 30, "d": 60 }
   * two.merge(one) // Map { "b": 20, "a": 10, "d": 60, "c": 30 }
   * ```
   *
   * Note: `merge` can be used in `withMutations`.
   *
   * @alias concat
   */
  merge<KC, VC>(...collections: Array<Iterable<[KC, VC]>>): Map<K | KC, V | VC>;
  merge<C>(...collections: Array<{ [key: string]: C }>): Map<K | string, V | C>;
  concat<KC, VC>(
    ...collections: Array<Iterable<[KC, VC]>>
  ): Map<K | KC, V | VC>;
  concat<C>(
    ...collections: Array<{ [key: string]: C }>
  ): Map<K | string, V | C>;

  /**
   * Like `merge()`, `mergeWith()` returns a new Map resulting from merging
   * the provided Collections (or JS objects) into this Map, but uses the
   * `merger` function for dealing with conflicts.
   *
   * <!-- runkit:activate -->
   * ```js
   * const { Map } = require('immutable')
   * const one = Map({ a: 10, b: 20, c: 30 })
   * const two = Map({ b: 40, a: 50, d: 60 })
   * one.mergeWith((oldVal, newVal) => oldVal / newVal, two)
   * // { "a": 0.2, "b": 0.5, "c": 30, "d": 60 }
   * two.mergeWith((oldVal, newVal) => oldVal / newVal, one)
   * // { "b": 2, "a": 5, "d": 60, "c": 30 }
   * ```
   *
   * Note: `mergeWith` can be used in `withMutations`.
   */
  mergeWith(
    merger: (oldVal: V, newVal: V, key: K) => V,
    ...collections: Array<Iterable<[K, V]> | { [key: string]: V }>
  ): this;

  /**
   * Like `merge()`, but when two compatible collections are encountered with
   * the same key, it merges them as well, recursing deeply through the nested
   * data. Two collections are considered to be compatible (and thus will be
   * merged together) if they both fall into one of three categories: keyed
   * (e.g., `Map`s, `Record`s, and objects), indexed (e.g., `List`s and
   * arrays), or set-like (e.g., `Set`s). If they fall into separate
   * categories, `mergeDeep` will replace the existing collection with the
   * collection being merged in. This behavior can be customized by using
   * `mergeDeepWith()`.
   *
   * Note: Indexed and set-like collections are merged using
   * `concat()`/`union()` and therefore do not recurse.
   *
   * <!-- runkit:activate -->
   * ```js
   * const { Map } = require('immutable')
   * const one = Map({ a: Map({ x: 10, y: 10 }), b: Map({ x: 20, y: 50 }) })
   * const two = Map({ a: Map({ x: 2 }), b: Map({ y: 5 }), c: Map({ z: 3 }) })
   * one.mergeDeep(two)
   * // Map {
   * //   "a": Map { "x": 2, "y": 10 },
   * //   "b": Map { "x": 20, "y": 5 },
   * //   "c": Map { "z": 3 }
   * // }
   * ```
   *
   * Note: `mergeDeep` can be used in `withMutations`.
   */
  mergeDeep(
    ...collections: Array<Iterable<[K, V]> | { [key: string]: V }>
  ): this;

  /**
   * Like `mergeDeep()`, but when two non-collections or incompatible
   * collections are encountered at the same key, it uses the `merger`
   * function to determine the resulting value. Collections are considered
   * incompatible if they fall into separate categories between keyed,
   * indexed, and set-like.
   *
   * <!-- runkit:activate -->
   * ```js
   * const { Map } = require('immutable')
   * const one = Map({ a: Map({ x: 10, y: 10 }), b: Map({ x: 20, y: 50 }) })
   * const two = Map({ a: Map({ x: 2 }), b: Map({ y: 5 }), c: Map({ z: 3 }) })
   * one.mergeDeepWith((oldVal, newVal) => oldVal / newVal, two)
   * // Map {
   * //   "a": Map { "x": 5, "y": 10 },
   * //   "b": Map { "x": 20, "y": 10 },
   * //   "c": Map { "z": 3 }
   * // }
   * ```
   *
   * Note: `mergeDeepWith` can be used in `withMutations`.
   */
  mergeDeepWith(
    merger: (oldVal: unknown, newVal: unknown, key: unknown) => unknown,
    ...collections: Array<Iterable<[K, V]> | { [key: string]: V }>
  ): this;

  // Deep persistent changes

  /**
   * Returns a new Map having set `value` at this `keyPath`. If any keys in
   * `keyPath` do not exist, a new immutable Map will be created at that key.
   *
   * <!-- runkit:activate -->
   * ```js
   * const { Map } = require('immutable')
   * const originalMap = Map({
   *   subObject: Map({
   *     subKey: 'subvalue',
   *     subSubObject: Map({
   *       subSubKey: 'subSubValue'
   *     })
   *   })
   * })
   *
   * const newMap = originalMap.setIn(['subObject', 'subKey'], 'ha ha!')
   * // Map {
   * //   "subObject": Map {
   * //     "subKey": "ha ha!",
   * //     "subSubObject": Map { "subSubKey": "subSubValue" }
   * //   }
   * // }
   *
   * const newerMap = originalMap.setIn(
   *   ['subObject', 'subSubObject', 'subSubKey'],
   *   'ha ha ha!'
   * )
   * // Map {
   * //   "subObject": Map {
   * //     "subKey": "subvalue",
   * //     "subSubObject": Map { "subSubKey": "ha ha ha!" }
   * //   }
   * // }
   * ```
   *
   * Plain JavaScript Object or Arrays may be nested within an Immutable.js
   * Collection, and setIn() can update those values as well, treating them
   * immutably by creating new copies of those values with the changes applied.
   *
   * <!-- runkit:activate -->
   * ```js
   * const { Map } = require('immutable')
   * const originalMap = Map({
   *   subObject: {
   *     subKey: 'subvalue',
   *     subSubObject: {
   *       subSubKey: 'subSubValue'
   *     }
   *   }
   * })
   *
   * originalMap.setIn(['subObject', 'subKey'], 'ha ha!')
   * // Map {
   * //   "subObject": {
   * //     subKey: "ha ha!",
   * //     subSubObject: { subSubKey: "subSubValue" }
   * //   }
   * // }
   * ```
   *
   * If any key in the path exists but cannot be updated (such as a primitive
   * like number or a custom Object like Date), an error will be thrown.
   *
   * Note: `setIn` can be used in `withMutations`.
   */
  setIn(keyPath: Iterable<unknown>, value: unknown): this;

  /**
   * Returns a new Map having removed the value at this `keyPath`. If any keys
   * in `keyPath` do not exist, no change will occur.
   *
   * Note: `deleteIn` can be used in `withMutations`.
   *
   * @alias removeIn
   */
  deleteIn(keyPath: Iterable<unknown>): this;
  removeIn(keyPath: Iterable<unknown>): this;

  /**
   * Returns a new Map having applied the `updater` to the entry found at the
   * keyPath.
   *
   * This is most commonly used to call methods on collections nested within a
   * structure of data. For example, in order to `.push()` onto a nested `List`,
   * `updateIn` and `push` can be used together:
   *
   * <!-- runkit:activate -->
   * ```js
   * const { Map, List } = require('immutable')
   * const map = Map({ inMap: Map({ inList: List([ 1, 2, 3 ]) }) })
   * const newMap = map.updateIn(['inMap', 'inList'], list => list.push(4))
   * // Map { "inMap": Map { "inList": List [ 1, 2, 3, 4 ] } }
   * ```
   *
   * If any keys in `keyPath` do not exist, new Immutable `Map`s will
   * be created at those keys. If the `keyPath` does not already contain a
   * value, the `updater` function will be called with `notSetValue`, if
   * provided, otherwise `undefined`.
   *
   * <!-- runkit:activate
   *      { "preamble": "const { Map } = require('immutable')" }
   * -->
   * ```js
   * const map = Map({ a: Map({ b: Map({ c: 10 }) }) })
   * const newMap = map.updateIn(['a', 'b', 'c'], val => val * 2)
   * // Map { "a": Map { "b": Map { "c": 20 } } }
   * ```
   *
   * If the `updater` function returns the same value it was called with, then
   * no change will occur. This is still true if `notSetValue` is provided.
   *
   * <!-- runkit:activate
   *      { "preamble": "const { Map } = require('immutable')" }
   * -->
   * ```js
   * const map = Map({ a: Map({ b: Map({ c: 10 }) }) })
   * const newMap = map.updateIn(['a', 'b', 'x'], 100, val => val)
   * // Map { "a": Map { "b": Map { "c": 10 } } }
   * assert.strictEqual(newMap, aMap)
   * ```
   *
   * For code using ES2015 or later, using `notSetValue` is discourged in
   * favor of function parameter default values. This helps to avoid any
   * potential confusion with identify functions as described above.
   *
   * The previous example behaves differently when written with default values:
   *
   * <!-- runkit:activate
   *      { "preamble": "const { Map } = require('immutable')" }
   * -->
   * ```js
   * const map = Map({ a: Map({ b: Map({ c: 10 }) }) })
   * const newMap = map.updateIn(['a', 'b', 'x'], (val = 100) => val)
   * // Map { "a": Map { "b": Map { "c": 10, "x": 100 } } }
   * ```
   *
   * Plain JavaScript Object or Arrays may be nested within an Immutable.js
   * Collection, and updateIn() can update those values as well, treating them
   * immutably by creating new copies of those values with the changes applied.
   *
   * <!-- runkit:activate
   *      { "preamble": "const { Map } = require('immutable')" }
   * -->
   * ```js
   * const map = Map({ a: { b: { c: 10 } } })
   * const newMap = map.updateIn(['a', 'b', 'c'], val => val * 2)
   * // Map { "a": { b: { c: 20 } } }
   * ```
   *
   * If any key in the path exists but cannot be updated (such as a primitive
   * like number or a custom Object like Date), an error will be thrown.
   *
   * Note: `updateIn` can be used in `withMutations`.
   */
  updateIn(
    keyPath: Iterable<unknown>,
    notSetValue: unknown,
    updater: (value: unknown) => unknown
  ): this;
  updateIn(
    keyPath: Iterable<unknown>,
    updater: (value: unknown) => unknown
  ): this;

  /**
   * A combination of `updateIn` and `merge`, returning a new Map, but
   * performing the merge at a point arrived at by following the keyPath.
   * In other words, these two lines are equivalent:
   *
   * ```js
   * map.updateIn(['a', 'b', 'c'], abc => abc.merge(y))
   * map.mergeIn(['a', 'b', 'c'], y)
   * ```
   *
   * Note: `mergeIn` can be used in `withMutations`.
   */
  mergeIn(keyPath: Iterable<unknown>, ...collections: Array<unknown>): this;

  /**
   * A combination of `updateIn` and `mergeDeep`, returning a new Map, but
   * performing the deep merge at a point arrived at by following the keyPath.
   * In other words, these two lines are equivalent:
   *
   * ```js
   * map.updateIn(['a', 'b', 'c'], abc => abc.mergeDeep(y))
   * map.mergeDeepIn(['a', 'b', 'c'], y)
   * ```
   *
   * Note: `mergeDeepIn` can be used in `withMutations`.
   */
  mergeDeepIn(keyPath: Iterable<unknown>, ...collections: Array<unknown>): this;

  // Transient changes

  /**
   * Every time you call one of the above functions, a new immutable Map is
   * created. If a pure function calls a number of these to produce a final
   * return value, then a penalty on performance and memory has been paid by
   * creating all of the intermediate immutable Maps.
   *
   * If you need to apply a series of mutations to produce a new immutable
   * Map, `withMutations()` creates a temporary mutable copy of the Map which
   * can apply mutations in a highly performant manner. In fact, this is
   * exactly how complex mutations like `merge` are done.
   *
   * As an example, this results in the creation of 2, not 4, new Maps:
   *
   * <!-- runkit:activate -->
   * ```js
   * const { Map } = require('immutable')
   * const map1 = Map()
   * const map2 = map1.withMutations(map => {
   *   map.set('a', 1).set('b', 2).set('c', 3)
   * })
   * assert.equal(map1.size, 0)
   * assert.equal(map2.size, 3)
   * ```
   *
   * Note: Not all methods can be used on a mutable collection or within
   * `withMutations`! Read the documentation for each method to see if it
   * is safe to use in `withMutations`.
   */
  withMutations(mutator: (mutable: this) => unknown): this;

  /**
   * Another way to avoid creation of intermediate Immutable maps is to create
   * a mutable copy of this collection. Mutable copies *always* return `this`,
   * and thus shouldn't be used for equality. Your function should never return
   * a mutable copy of a collection, only use it internally to create a new
   * collection.
   *
   * If possible, use `withMutations` to work with temporary mutable copies as
   * it provides an easier to use API and considers many common optimizations.
   *
   * Note: if the collection is already mutable, `asMutable` returns itself.
   *
   * Note: Not all methods can be used on a mutable collection or within
   * `withMutations`! Read the documentation for each method to see if it
   * is safe to use in `withMutations`.
   *
   * @see `Map#asImmutable`
   */
  asMutable(): this;

  /**
   * Returns true if this is a mutable copy (see `asMutable()`) and mutative
   * alterations have been applied.
   *
   * @see `Map#asMutable`
   */
  wasAltered(): boolean;

  /**
   * The yin to `asMutable`'s yang. Because it applies to mutable collections,
   * this operation is *mutable* and may return itself (though may not
   * return itself, i.e. if the result is an empty collection). Once
   * performed, the original mutable copy must no longer be mutated since it
   * may be the immutable result.
   *
   * If possible, use `withMutations` to work with temporary mutable copies as
   * it provides an easier to use API and considers many common optimizations.
   *
   * @see `Map#asMutable`
   */
  asImmutable(): this;

  // Sequence algorithms

  /**
   * Returns a new Map with values passed through a
   * `mapper` function.
   *
   *     Map({ a: 1, b: 2 }).map(x => 10 * x)
   *     // Map { a: 10, b: 20 }
   */
  map<M>(
    mapper: (value: V, key: K, iter: this) => M,
    context?: unknown
  ): Map<K, M>;

  /**
   * @see Collection.Keyed.mapKeys
   */
  mapKeys<M>(
    mapper: (key: K, value: V, iter: this) => M,
    context?: unknown
  ): Map<M, V>;

  /**
   * @see Collection.Keyed.mapEntries
   */
  mapEntries<KM, VM>(
    mapper: (entry: [K, V], index: number, iter: this) => [KM, VM] | undefined,
    context?: unknown
  ): Map<KM, VM>;

  /**
   * Flat-maps the Map, returning a new Map.
   *
   * Similar to `data.map(...).flatten(true)`.
   */
  flatMap<KM, VM>(
    mapper: (value: V, key: K, iter: this) => Iterable<[KM, VM]>,
    context?: unknown
  ): Map<KM, VM>;

  /**
   * Returns a new Map with only the entries for which the `predicate`
   * function returns true.
   *
   * Note: `filter()` always returns a new instance, even if it results in
   * not filtering out any values.
   */
  filter<F extends V>(
    predicate: (value: V, key: K, iter: this) => value is F,
    context?: unknown
  ): Map<K, F>;
  filter(
    predicate: (value: V, key: K, iter: this) => unknown,
    context?: unknown
  ): this;

  /**
   * @see Collection.Keyed.flip
   */
  flip(): Map<V, K>;
}

/**
 * `Seq` describes a lazy operation, allowing them to efficiently chain
 * use of all the higher-order collection methods (such as `map` and `filter`)
 * by not creating intermediate collections.
 *
 * **Seq is immutable** — Once a Seq is created, it cannot be
 * changed, appended to, rearranged or otherwise modified. Instead, any
 * mutative method called on a `Seq` will return a new `Seq`.
 *
 * **Seq is lazy** — `Seq` does as little work as necessary to respond to any
 * method call. Values are often created during iteration, including implicit
 * iteration when reducing or converting to a concrete data structure such as
 * a `List` or JavaScript `Array`.
 *
 * For example, the following performs no work, because the resulting
 * `Seq`'s values are never iterated:
 *
 * ```js
 * const { Seq } = require('immutable')
 * const oddSquares = Seq([ 1, 2, 3, 4, 5, 6, 7, 8 ])
 *   .filter(x => x % 2 !== 0)
 *   .map(x => x * x)
 * ```
 *
 * Once the `Seq` is used, it performs only the work necessary. In this
 * example, no intermediate arrays are ever created, filter is called three
 * times, and map is only called once:
 *
 * ```js
 * oddSquares.get(1); // 9
 * ```
 *
 * Any collection can be converted to a lazy Seq with `Seq()`.
 *
 * <!-- runkit:activate -->
 * ```js
 * const { Map } = require('immutable')
 * const map = Map({ a: 1, b: 2, c: 3 })
 * const lazySeq = Seq(map)
 * ```
 *
 * `Seq` allows for the efficient chaining of operations, allowing for the
 * expression of logic that can otherwise be very tedious:
 *
 * ```js
 * lazySeq
 *   .flip()
 *   .map(key => key.toUpperCase())
 *   .flip()
 * // Seq { A: 1, B: 1, C: 1 }
 * ```
 *
 * As well as expressing logic that would otherwise seem memory or time
 * limited, for example `Range` is a special kind of Lazy sequence.
 *
 * <!-- runkit:activate -->
 * ```js
 * const { Range } = require('immutable')
 * Range(1, Infinity)
 *   .skip(1000)
 *   .map(n => -n)
 *   .filter(n => n % 2 === 0)
 *   .take(2)
 *   .reduce((r, n) => r * n, 1)
 * // 1006008
 * ```
 *
 * Seq is often used to provide a rich collection API to JavaScript Object.
 *
 * ```js
 * Seq({ x: 0, y: 1, z: 2 }).map(v => v * 2).toObject();
 * // { x: 0, y: 2, z: 4 }
 * ```
 */

namespace Seq {
  /**
   * True if `maybeSeq` is a Seq, it is not backed by a concrete
   * structure such as Map, List, or Set.
   */
  function isSeq(
    maybeSeq: unknown
  ): maybeSeq is
    | Seq.Indexed<unknown>
    | Seq.Keyed<unknown, unknown>
    | Seq.Set<unknown>;

  /**
   * `Seq` which represents key-value pairs.
   */
  namespace Keyed {}

  /**
   * Always returns a Seq.Keyed, if input is not keyed, expects an
   * collection of [K, V] tuples.
   *
   * Note: `Seq.Keyed` is a conversion function and not a class, and does not
   * use the `new` keyword during construction.
   */
  function Keyed<K, V>(collection?: Iterable<[K, V]>): Seq.Keyed<K, V>;
  function Keyed<V>(obj: { [key: string]: V }): Seq.Keyed<string, V>;

  interface Keyed<K, V> extends Seq<K, V>, Collection.Keyed<K, V> {
    /**
     * Deeply converts this Keyed Seq to equivalent native JavaScript Object.
     *
     * Converts keys to Strings.
     */
    toJS(): { [key: string]: unknown };

    /**
     * Shallowly converts this Keyed Seq to equivalent native JavaScript Object.
     *
     * Converts keys to Strings.
     */
    toJSON(): { [key: string]: V };

    /**
     * Shallowly converts this collection to an Array.
     */
    toArray(): Array<[K, V]>;

    /**
     * Returns itself
     */
    toSeq(): this;

    /**
     * Returns a new Seq with other collections concatenated to this one.
     *
     * All entries will be present in the resulting Seq, even if they
     * have the same key.
     */
    concat<KC, VC>(
      ...collections: Array<Iterable<[KC, VC]>>
    ): Seq.Keyed<K | KC, V | VC>;
    concat<C>(
      ...collections: Array<{ [key: string]: C }>
    ): Seq.Keyed<K | string, V | C>;

    /**
     * Returns a new Seq.Keyed with values passed through a
     * `mapper` function.
     *
     * ```js
     * const { Seq } = require('immutable')
     * Seq.Keyed({ a: 1, b: 2 }).map(x => 10 * x)
     * // Seq { "a": 10, "b": 20 }
     * ```
     *
     * Note: `map()` always returns a new instance, even if it produced the
     * same value at every step.
     */
    map<M>(
      mapper: (value: V, key: K, iter: this) => M,
      context?: unknown
    ): Seq.Keyed<K, M>;

    /**
     * @see Collection.Keyed.mapKeys
     */
    mapKeys<M>(
      mapper: (key: K, value: V, iter: this) => M,
      context?: unknown
    ): Seq.Keyed<M, V>;

    /**
     * @see Collection.Keyed.mapEntries
     */
    mapEntries<KM, VM>(
      mapper: (
        entry: [K, V],
        index: number,
        iter: this
      ) => [KM, VM] | undefined,
      context?: unknown
    ): Seq.Keyed<KM, VM>;

    /**
     * Flat-maps the Seq, returning a Seq of the same type.
     *
     * Similar to `seq.map(...).flatten(true)`.
     */
    flatMap<KM, VM>(
      mapper: (value: V, key: K, iter: this) => Iterable<[KM, VM]>,
      context?: unknown
    ): Seq.Keyed<KM, VM>;

    /**
     * Returns a new Seq with only the entries for which the `predicate`
     * function returns true.
     *
     * Note: `filter()` always returns a new instance, even if it results in
     * not filtering out any values.
     */
    filter<F extends V>(
      predicate: (value: V, key: K, iter: this) => value is F,
      context?: unknown
    ): Seq.Keyed<K, F>;
    filter(
      predicate: (value: V, key: K, iter: this) => unknown,
      context?: unknown
    ): this;

    /**
     * @see Collection.Keyed.flip
     */
    flip(): Seq.Keyed<V, K>;

    [Symbol.iterator](): IterableIterator<[K, V]>;
  }

  /**
   * `Seq` which represents an ordered indexed list of values.
   */
  namespace Indexed {
    /**
     * Provides an Seq.Indexed of the values provided.
     */
    function of<T>(...values: Array<T>): Seq.Indexed<T>;
  }

  /**
   * Always returns Seq.Indexed, discarding associated keys and
   * supplying incrementing indices.
   *
   * Note: `Seq.Indexed` is a conversion function and not a class, and does
   * not use the `new` keyword during construction.
   */
  function Indexed<T>(collection?: Iterable<T> | ArrayLike<T>): Seq.Indexed<T>;

  interface Indexed<T> extends Seq<number, T>, Collection.Indexed<T> {
    /**
     * Deeply converts this Indexed Seq to equivalent native JavaScript Array.
     */
    toJS(): Array<unknown>;

    /**
     * Shallowly converts this Indexed Seq to equivalent native JavaScript Array.
     */
    toJSON(): Array<T>;

    /**
     * Shallowly converts this collection to an Array.
     */
    toArray(): Array<T>;

    /**
     * Returns itself
     */
    toSeq(): this;

    /**
     * Returns a new Seq with other collections concatenated to this one.
     */
    concat<C>(
      ...valuesOrCollections: Array<Iterable<C> | C>
    ): Seq.Indexed<T | C>;

    /**
     * Returns a new Seq.Indexed with values passed through a
     * `mapper` function.
     *
     * ```js
     * const { Seq } = require('immutable')
     * Seq.Indexed([ 1, 2 ]).map(x => 10 * x)
     * // Seq [ 10, 20 ]
     * ```
     *
     * Note: `map()` always returns a new instance, even if it produced the
     * same value at every step.
     */
    map<M>(
      mapper: (value: T, key: number, iter: this) => M,
      context?: unknown
    ): Seq.Indexed<M>;

    /**
     * Flat-maps the Seq, returning a a Seq of the same type.
     *
     * Similar to `seq.map(...).flatten(true)`.
     */
    flatMap<M>(
      mapper: (value: T, key: number, iter: this) => Iterable<M>,
      context?: unknown
    ): Seq.Indexed<M>;

    /**
     * Returns a new Seq with only the values for which the `predicate`
     * function returns true.
     *
     * Note: `filter()` always returns a new instance, even if it results in
     * not filtering out any values.
     */
    filter<F extends T>(
      predicate: (value: T, index: number, iter: this) => value is F,
      context?: unknown
    ): Seq.Indexed<F>;
    filter(
      predicate: (value: T, index: number, iter: this) => unknown,
      context?: unknown
    ): this;

    /**
     * Returns a Seq "zipped" with the provided collections.
     *
     * Like `zipWith`, but using the default `zipper`: creating an `Array`.
     *
     * ```js
     * const a = Seq([ 1, 2, 3 ]);
     * const b = Seq([ 4, 5, 6 ]);
     * const c = a.zip(b); // Seq [ [ 1, 4 ], [ 2, 5 ], [ 3, 6 ] ]
     * ```
     */
    zip<U>(other: Collection<unknown, U>): Seq.Indexed<[T, U]>;
    zip<U, V>(
      other: Collection<unknown, U>,
      other2: Collection<unknown, V>
    ): Seq.Indexed<[T, U, V]>;
    zip(
      ...collections: Array<Collection<unknown, unknown>>
    ): Seq.Indexed<unknown>;

    /**
     * Returns a Seq "zipped" with the provided collections.
     *
     * Unlike `zip`, `zipAll` continues zipping until the longest collection is
     * exhausted. Missing values from shorter collections are filled with `undefined`.
     *
     * ```js
     * const a = Seq([ 1, 2 ]);
     * const b = Seq([ 3, 4, 5 ]);
     * const c = a.zipAll(b); // Seq [ [ 1, 3 ], [ 2, 4 ], [ undefined, 5 ] ]
     * ```
     */
    zipAll<U>(other: Collection<unknown, U>): Seq.Indexed<[T, U]>;
    zipAll<U, V>(
      other: Collection<unknown, U>,
      other2: Collection<unknown, V>
    ): Seq.Indexed<[T, U, V]>;
    zipAll(
      ...collections: Array<Collection<unknown, unknown>>
    ): Seq.Indexed<unknown>;

    /**
     * Returns a Seq "zipped" with the provided collections by using a
     * custom `zipper` function.
     *
     * ```js
     * const a = Seq([ 1, 2, 3 ]);
     * const b = Seq([ 4, 5, 6 ]);
     * const c = a.zipWith((a, b) => a + b, b);
     * // Seq [ 5, 7, 9 ]
     * ```
     */
    zipWith<U, Z>(
      zipper: (value: T, otherValue: U) => Z,
      otherCollection: Collection<unknown, U>
    ): Seq.Indexed<Z>;
    zipWith<U, V, Z>(
      zipper: (value: T, otherValue: U, thirdValue: V) => Z,
      otherCollection: Collection<unknown, U>,
      thirdCollection: Collection<unknown, V>
    ): Seq.Indexed<Z>;
    zipWith<Z>(
      zipper: (...values: Array<unknown>) => Z,
      ...collections: Array<Collection<unknown, unknown>>
    ): Seq.Indexed<Z>;

    [Symbol.iterator](): IterableIterator<T>;
  }

  /**
   * `Seq` which represents a set of values.
   *
   * Because `Seq` are often lazy, `Seq.Set` does not provide the same guarantee
   * of value uniqueness as the concrete `Set`.
   */
  namespace Set {
    /**
     * Returns a Seq.Set of the provided values
     */
    function of<T>(...values: Array<T>): Seq.Set<T>;
  }

  /**
   * Always returns a Seq.Set, discarding associated indices or keys.
   *
   * Note: `Seq.Set` is a conversion function and not a class, and does not
   * use the `new` keyword during construction.
   */
  function Set<T>(collection?: Iterable<T> | ArrayLike<T>): Seq.Set<T>;

  interface Set<T> extends Seq<T, T>, Collection.Set<T> {
    /**
     * Deeply converts this Set Seq to equivalent native JavaScript Array.
     */
    toJS(): Array<unknown>;

    /**
     * Shallowly converts this Set Seq to equivalent native JavaScript Array.
     */
    toJSON(): Array<T>;

    /**
     * Shallowly converts this collection to an Array.
     */
    toArray(): Array<T>;

    /**
     * Returns itself
     */
    toSeq(): this;

    /**
     * Returns a new Seq with other collections concatenated to this one.
     *
     * All entries will be present in the resulting Seq, even if they
     * are duplicates.
     */
    concat<U>(...collections: Array<Iterable<U>>): Seq.Set<T | U>;

    /**
     * Returns a new Seq.Set with values passed through a
     * `mapper` function.
     *
     * ```js
     * Seq.Set([ 1, 2 ]).map(x => 10 * x)
     * // Seq { 10, 20 }
     * ```
     *
     * Note: `map()` always returns a new instance, even if it produced the
     * same value at every step.
     */
    map<M>(
      mapper: (value: T, key: T, iter: this) => M,
      context?: unknown
    ): Seq.Set<M>;

    /**
     * Flat-maps the Seq, returning a Seq of the same type.
     *
     * Similar to `seq.map(...).flatten(true)`.
     */
    flatMap<M>(
      mapper: (value: T, key: T, iter: this) => Iterable<M>,
      context?: unknown
    ): Seq.Set<M>;

    /**
     * Returns a new Seq with only the values for which the `predicate`
     * function returns true.
     *
     * Note: `filter()` always returns a new instance, even if it results in
     * not filtering out any values.
     */
    filter<F extends T>(
      predicate: (value: T, key: T, iter: this) => value is F,
      context?: unknown
    ): Seq.Set<F>;
    filter(
      predicate: (value: T, key: T, iter: this) => unknown,
      context?: unknown
    ): this;

    [Symbol.iterator](): IterableIterator<T>;
  }
}

/**
 * Creates a Seq.
 *
 * Returns a particular kind of `Seq` based on the input.
 *
 *   * If a `Seq`, that same `Seq`.
 *   * If an `Collection`, a `Seq` of the same kind (Keyed, Indexed, or Set).
 *   * If an Array-like, an `Seq.Indexed`.
 *   * If an Iterable Object, an `Seq.Indexed`.
 *   * If an Object, a `Seq.Keyed`.
 *
 * Note: An Iterator itself will be treated as an object, becoming a `Seq.Keyed`,
 * which is usually not what you want. You should turn your Iterator Object into
 * an iterable object by defining a Symbol.iterator (or @@iterator) method which
 * returns `this`.
 *
 * Note: `Seq` is a conversion function and not a class, and does not use the
 * `new` keyword during construction.
 */
function Seq<S extends Seq<unknown, unknown>>(seq: S): S;
function Seq<K, V>(collection: Collection.Keyed<K, V>): Seq.Keyed<K, V>;
function Seq<T>(collection: Collection.Set<T>): Seq.Set<T>;
function Seq<T>(
  collection: Collection.Indexed<T> | Iterable<T> | ArrayLike<T>
): Seq.Indexed<T>;
function Seq<V>(obj: { [key: string]: V }): Seq.Keyed<string, V>;
function Seq<K = unknown, V = unknown>(): Seq<K, V>;

interface Seq<K, V> extends Collection<K, V> {
  /**
   * Some Seqs can describe their size lazily. When this is the case,
   * size will be an integer. Otherwise it will be undefined.
   *
   * For example, Seqs returned from `map()` or `reverse()`
   * preserve the size of the original `Seq` while `filter()` does not.
   *
   * Note: `Range`, `Repeat` and `Seq`s made from `Array`s and `Object`s will
   * always have a size.
   */
  readonly size: number | undefined;

  // Force evaluation

  /**
   * Because Sequences are lazy and designed to be chained together, they do
   * not cache their results. For example, this map function is called a total
   * of 6 times, as each `join` iterates the Seq of three values.
   *
   *     var squares = Seq([ 1, 2, 3 ]).map(x => x * x)
   *     squares.join() + squares.join()
   *
   * If you know a `Seq` will be used multiple times, it may be more
   * efficient to first cache it in memory. Here, the map function is called
   * only 3 times.
   *
   *     var squares = Seq([ 1, 2, 3 ]).map(x => x * x).cacheResult()
   *     squares.join() + squares.join()
   *
   * Use this method judiciously, as it must fully evaluate a Seq which can be
   * a burden on memory and possibly performance.
   *
   * Note: after calling `cacheResult`, a Seq will always have a `size`.
   */
  cacheResult(): this;

  // Sequence algorithms

  /**
   * Returns a new Seq with values passed through a
   * `mapper` function.
   *
   * ```js
   * const { Seq } = require('immutable')
   * Seq([ 1, 2 ]).map(x => 10 * x)
   * // Seq [ 10, 20 ]
   * ```
   *
   * Note: `map()` always returns a new instance, even if it produced the same
   * value at every step.
   */
  map<M>(
    mapper: (value: V, key: K, iter: this) => M,
    context?: unknown
  ): Seq<K, M>;

  /**
   * Returns a new Seq with values passed through a
   * `mapper` function.
   *
   * ```js
   * const { Seq } = require('immutable')
   * Seq([ 1, 2 ]).map(x => 10 * x)
   * // Seq [ 10, 20 ]
   * ```
   *
   * Note: `map()` always returns a new instance, even if it produced the same
   * value at every step.
   * Note: used only for sets.
   */
  map<M>(
    mapper: (value: V, key: K, iter: this) => M,
    context?: unknown
  ): Seq<M, M>;

  /**
   * Flat-maps the Seq, returning a Seq of the same type.
   *
   * Similar to `seq.map(...).flatten(true)`.
   */
  flatMap<M>(
    mapper: (value: V, key: K, iter: this) => Iterable<M>,
    context?: unknown
  ): Seq<K, M>;

  /**
   * Flat-maps the Seq, returning a Seq of the same type.
   *
   * Similar to `seq.map(...).flatten(true)`.
   * Note: Used only for sets.
   */
  flatMap<M>(
    mapper: (value: V, key: K, iter: this) => Iterable<M>,
    context?: unknown
  ): Seq<M, M>;

  /**
   * Returns a new Seq with only the values for which the `predicate`
   * function returns true.
   *
   * Note: `filter()` always returns a new instance, even if it results in
   * not filtering out any values.
   */
  filter<F extends V>(
    predicate: (value: V, key: K, iter: this) => value is F,
    context?: unknown
  ): Seq<K, F>;
  filter(
    predicate: (value: V, key: K, iter: this) => unknown,
    context?: unknown
  ): this;
}

/**
 * The `Collection` is a set of (key, value) entries which can be iterated, and
 * is the base class for all collections in `immutable`, allowing them to
 * make use of all the Collection methods (such as `map` and `filter`).
 *
 * Note: A collection is always iterated in the same order, however that order
 * may not always be well defined, as is the case for the `Map` and `Set`.
 *
 * Collection is the abstract base class for concrete data structures. It
 * cannot be constructed directly.
 *
 * Implementations should extend one of the subclasses, `Collection.Keyed`,
 * `Collection.Indexed`, or `Collection.Set`.
 */
namespace Collection {
  /**
   * @deprecated use `const { isKeyed } = require('immutable')`
   */
  function isKeyed(
    maybeKeyed: unknown
  ): maybeKeyed is Collection.Keyed<unknown, unknown>;

  /**
   * @deprecated use `const { isIndexed } = require('immutable')`
   */
  function isIndexed(
    maybeIndexed: unknown
  ): maybeIndexed is Collection.Indexed<unknown>;

  /**
   * @deprecated use `const { isAssociative } = require('immutable')`
   */
  function isAssociative(
    maybeAssociative: unknown
  ): maybeAssociative is
    | Collection.Keyed<unknown, unknown>
    | Collection.Indexed<unknown>;

  /**
   * @deprecated use `const { isOrdered } = require('immutable')`
   */
  function isOrdered(maybeOrdered: unknown): boolean;

  /**
   * Keyed Collections have discrete keys tied to each value.
   *
   * When iterating `Collection.Keyed`, each iteration will yield a `[K, V]`
   * tuple, in other words, `Collection#entries` is the default iterator for
   * Keyed Collections.
   */
  namespace Keyed {}

  /**
   * Creates a Collection.Keyed
   *
   * Similar to `Collection()`, however it expects collection-likes of [K, V]
   * tuples if not constructed from a Collection.Keyed or JS Object.
   *
   * Note: `Collection.Keyed` is a conversion function and not a class, and
   * does not use the `new` keyword during construction.
   */
  function Keyed<K, V>(collection?: Iterable<[K, V]>): Collection.Keyed<K, V>;
  function Keyed<V>(obj: { [key: string]: V }): Collection.Keyed<string, V>;

  interface Keyed<K, V> extends Collection<K, V> {
    /**
     * Deeply converts this Keyed collection to equivalent native JavaScript Object.
     *
     * Converts keys to Strings.
     */
    toJS(): { [key: string]: unknown };

    /**
     * Shallowly converts this Keyed collection to equivalent native JavaScript Object.
     *
     * Converts keys to Strings.
     */
    toJSON(): { [key: string]: V };

    /**
     * Shallowly converts this collection to an Array.
     */
    toArray(): Array<[K, V]>;

    /**
     * Returns Seq.Keyed.
     * @override
     */
    toSeq(): Seq.Keyed<K, V>;

    // Sequence functions

    /**
     * Returns a new Collection.Keyed of the same type where the keys and values
     * have been flipped.
     *
     * <!-- runkit:activate -->
     * ```js
     * const { Map } = require('immutable')
     * Map({ a: 'z', b: 'y' }).flip()
     * // Map { "z": "a", "y": "b" }
     * ```
     */
    flip(): Collection.Keyed<V, K>;

    /**
     * Returns a new Collection with other collections concatenated to this one.
     */
    concat<KC, VC>(
      ...collections: Array<Iterable<[KC, VC]>>
    ): Collection.Keyed<K | KC, V | VC>;
    concat<C>(
      ...collections: Array<{ [key: string]: C }>
    ): Collection.Keyed<K | string, V | C>;

    /**
     * Returns a new Collection.Keyed with values passed through a
     * `mapper` function.
     *
     * ```js
     * const { Collection } = require('immutable')
     * Collection.Keyed({ a: 1, b: 2 }).map(x => 10 * x)
     * // Seq { "a": 10, "b": 20 }
     * ```
     *
     * Note: `map()` always returns a new instance, even if it produced the
     * same value at every step.
     */
    map<M>(
      mapper: (value: V, key: K, iter: this) => M,
      context?: unknown
    ): Collection.Keyed<K, M>;

    /**
     * Returns a new Collection.Keyed of the same type with keys passed through
     * a `mapper` function.
     *
     * <!-- runkit:activate -->
     * ```js
     * const { Map } = require('immutable')
     * Map({ a: 1, b: 2 }).mapKeys(x => x.toUpperCase())
     * // Map { "A": 1, "B": 2 }
     * ```
     *
     * Note: `mapKeys()` always returns a new instance, even if it produced
     * the same key at every step.
     */
    mapKeys<M>(
      mapper: (key: K, value: V, iter: this) => M,
      context?: unknown
    ): Collection.Keyed<M, V>;

    /**
     * Returns a new Collection.Keyed of the same type with entries
     * ([key, value] tuples) passed through a `mapper` function.
     *
     * <!-- runkit:activate -->
     * ```js
     * const { Map } = require('immutable')
     * Map({ a: 1, b: 2 })
     *   .mapEntries(([ k, v ]) => [ k.toUpperCase(), v * 2 ])
     * // Map { "A": 2, "B": 4 }
     * ```
     *
     * Note: `mapEntries()` always returns a new instance, even if it produced
     * the same entry at every step.
     *
     * If the mapper function returns `undefined`, then the entry will be filtered
     */
    mapEntries<KM, VM>(
      mapper: (
        entry: [K, V],
        index: number,
        iter: this
      ) => [KM, VM] | undefined,
      context?: unknown
    ): Collection.Keyed<KM, VM>;

    /**
     * Flat-maps the Collection, returning a Collection of the same type.
     *
     * Similar to `collection.map(...).flatten(true)`.
     */
    flatMap<KM, VM>(
      mapper: (value: V, key: K, iter: this) => Iterable<[KM, VM]>,
      context?: unknown
    ): Collection.Keyed<KM, VM>;

    /**
     * Returns a new Collection with only the values for which the `predicate`
     * function returns true.
     *
     * Note: `filter()` always returns a new instance, even if it results in
     * not filtering out any values.
     */
    filter<F extends V>(
      predicate: (value: V, key: K, iter: this) => value is F,
      context?: unknown
    ): Collection.Keyed<K, F>;
    filter(
      predicate: (value: V, key: K, iter: this) => unknown,
      context?: unknown
    ): this;

    [Symbol.iterator](): IterableIterator<[K, V]>;
  }

  /**
   * Indexed Collections have incrementing numeric keys. They exhibit
   * slightly different behavior than `Collection.Keyed` for some methods in order
   * to better mirror the behavior of JavaScript's `Array`, and add methods
   * which do not make sense on non-indexed Collections such as `indexOf`.
   *
   * Unlike JavaScript arrays, `Collection.Indexed`s are always dense. "Unset"
   * indices and `undefined` indices are indistinguishable, and all indices from
   * 0 to `size` are visited when iterated.
   *
   * All Collection.Indexed methods return re-indexed Collections. In other words,
   * indices always start at 0 and increment until size. If you wish to
   * preserve indices, using them as keys, convert to a Collection.Keyed by
   * calling `toKeyedSeq`.
   */
  namespace Indexed {}

  /**
   * Creates a new Collection.Indexed.
   *
   * Note: `Collection.Indexed` is a conversion function and not a class, and
   * does not use the `new` keyword during construction.
   */
  function Indexed<T>(
    collection?: Iterable<T> | ArrayLike<T>
  ): Collection.Indexed<T>;

  interface Indexed<T> extends Collection<number, T> {
    /**
     * Deeply converts this Indexed collection to equivalent native JavaScript Array.
     */
    toJS(): Array<unknown>;

    /**
     * Shallowly converts this Indexed collection to equivalent native JavaScript Array.
     */
    toJSON(): Array<T>;

    /**
     * Shallowly converts this collection to an Array.
     */
    toArray(): Array<T>;

    // Reading values

    /**
     * Returns the value associated with the provided index, or notSetValue if
     * the index is beyond the bounds of the Collection.
     *
     * `index` may be a negative number, which indexes back from the end of the
     * Collection. `s.get(-1)` gets the last item in the Collection.
     */
    get<NSV>(index: number, notSetValue: NSV): T | NSV;
    get(index: number): T | undefined;

    // Conversion to Seq

    /**
     * Returns Seq.Indexed.
     * @override
     */
    toSeq(): Seq.Indexed<T>;

    /**
     * If this is a collection of [key, value] entry tuples, it will return a
     * Seq.Keyed of those entries.
     */
    fromEntrySeq(): Seq.Keyed<unknown, unknown>;

    // Combination

    /**
     * Returns a Collection of the same type with `separator` between each item
     * in this Collection.
     */
    interpose(separator: T): this;

    /**
     * Returns a Collection of the same type with the provided `collections`
     * interleaved into this collection.
     *
     * The resulting Collection includes the first item from each, then the
     * second from each, etc.
     *
     * <!-- runkit:activate
     *      { "preamble": "require('immutable')"}
     * -->
     * ```js
     * const { List } = require('immutable')
     * List([ 1, 2, 3 ]).interleave(List([ 'A', 'B', 'C' ]))
     * // List [ 1, "A", 2, "B", 3, "C" ]
     * ```
     *
     * The shortest Collection stops interleave.
     *
     * <!-- runkit:activate
     *      { "preamble": "const { List } = require('immutable')" }
     * -->
     * ```js
     * List([ 1, 2, 3 ]).interleave(
     *   List([ 'A', 'B' ]),
     *   List([ 'X', 'Y', 'Z' ])
     * )
     * // List [ 1, "A", "X", 2, "B", "Y" ]
     * ```
     *
     * Since `interleave()` re-indexes values, it produces a complete copy,
     * which has `O(N)` complexity.
     *
     * Note: `interleave` *cannot* be used in `withMutations`.
     */
    interleave(...collections: Array<Collection<unknown, T>>): this;

    /**
     * Splice returns a new indexed Collection by replacing a region of this
     * Collection with new values. If values are not provided, it only skips the
     * region to be removed.
     *
     * `index` may be a negative number, which indexes back from the end of the
     * Collection. `s.splice(-2)` splices after the second to last item.
     *
     * <!-- runkit:activate -->
     * ```js
     * const { List } = require('immutable')
     * List([ 'a', 'b', 'c', 'd' ]).splice(1, 2, 'q', 'r', 's')
     * // List [ "a", "q", "r", "s", "d" ]
     * ```
     *
     * Since `splice()` re-indexes values, it produces a complete copy, which
     * has `O(N)` complexity.
     *
     * Note: `splice` *cannot* be used in `withMutations`.
     */
    splice(index: number, removeNum: number, ...values: Array<T>): this;

    /**
     * Returns a Collection of the same type "zipped" with the provided
     * collections.
     *
     * Like `zipWith`, but using the default `zipper`: creating an `Array`.
     *
     *
     * <!-- runkit:activate
     *      { "preamble": "const { List } = require('immutable')" }
     * -->
     * ```js
     * const a = List([ 1, 2, 3 ]);
     * const b = List([ 4, 5, 6 ]);
     * const c = a.zip(b); // List [ [ 1, 4 ], [ 2, 5 ], [ 3, 6 ] ]
     * ```
     */
    zip<U>(other: Collection<unknown, U>): Collection.Indexed<[T, U]>;
    zip<U, V>(
      other: Collection<unknown, U>,
      other2: Collection<unknown, V>
    ): Collection.Indexed<[T, U, V]>;
    zip(
      ...collections: Array<Collection<unknown, unknown>>
    ): Collection.Indexed<unknown>;

    /**
     * Returns a Collection "zipped" with the provided collections.
     *
     * Unlike `zip`, `zipAll` continues zipping until the longest collection is
     * exhausted. Missing values from shorter collections are filled with `undefined`.
     *
     * ```js
     * const a = List([ 1, 2 ]);
     * const b = List([ 3, 4, 5 ]);
     * const c = a.zipAll(b); // List [ [ 1, 3 ], [ 2, 4 ], [ undefined, 5 ] ]
     * ```
     */
    zipAll<U>(other: Collection<unknown, U>): Collection.Indexed<[T, U]>;
    zipAll<U, V>(
      other: Collection<unknown, U>,
      other2: Collection<unknown, V>
    ): Collection.Indexed<[T, U, V]>;
    zipAll(
      ...collections: Array<Collection<unknown, unknown>>
    ): Collection.Indexed<unknown>;

    /**
     * Returns a Collection of the same type "zipped" with the provided
     * collections by using a custom `zipper` function.
     *
     * <!-- runkit:activate
     *      { "preamble": "const { List } = require('immutable')" }
     * -->
     * ```js
     * const a = List([ 1, 2, 3 ]);
     * const b = List([ 4, 5, 6 ]);
     * const c = a.zipWith((a, b) => a + b, b);
     * // List [ 5, 7, 9 ]
     * ```
     */
    zipWith<U, Z>(
      zipper: (value: T, otherValue: U) => Z,
      otherCollection: Collection<unknown, U>
    ): Collection.Indexed<Z>;
    zipWith<U, V, Z>(
      zipper: (value: T, otherValue: U, thirdValue: V) => Z,
      otherCollection: Collection<unknown, U>,
      thirdCollection: Collection<unknown, V>
    ): Collection.Indexed<Z>;
    zipWith<Z>(
      zipper: (...values: Array<unknown>) => Z,
      ...collections: Array<Collection<unknown, unknown>>
    ): Collection.Indexed<Z>;

    // Search for value

    /**
     * Returns the first index at which a given value can be found in the
     * Collection, or -1 if it is not present.
     */
    indexOf(searchValue: T): number;

    /**
     * Returns the last index at which a given value can be found in the
     * Collection, or -1 if it is not present.
     */
    lastIndexOf(searchValue: T): number;

    /**
     * Returns the first index in the Collection where a value satisfies the
     * provided predicate function. Otherwise -1 is returned.
     */
    findIndex(
      predicate: (value: T, index: number, iter: this) => boolean,
      context?: unknown
    ): number;

    /**
     * Returns the last index in the Collection where a value satisfies the
     * provided predicate function. Otherwise -1 is returned.
     */
    findLastIndex(
      predicate: (value: T, index: number, iter: this) => boolean,
      context?: unknown
    ): number;

    // Sequence algorithms

    /**
     * Returns a new Collection with other collections concatenated to this one.
     */
    concat<C>(
      ...valuesOrCollections: Array<Iterable<C> | C>
    ): Collection.Indexed<T | C>;

    /**
     * Returns a new Collection.Indexed with values passed through a
     * `mapper` function.
     *
     * ```js
     * const { Collection } = require('immutable')
     * Collection.Indexed([1,2]).map(x => 10 * x)
     * // Seq [ 1, 2 ]
     * ```
     *
     * Note: `map()` always returns a new instance, even if it produced the
     * same value at every step.
     */
    map<M>(
      mapper: (value: T, key: number, iter: this) => M,
      context?: unknown
    ): Collection.Indexed<M>;

    /**
     * Flat-maps the Collection, returning a Collection of the same type.
     *
     * Similar to `collection.map(...).flatten(true)`.
     */
    flatMap<M>(
      mapper: (value: T, key: number, iter: this) => Iterable<M>,
      context?: unknown
    ): Collection.Indexed<M>;

    /**
     * Returns a new Collection with only the values for which the `predicate`
     * function returns true.
     *
     * Note: `filter()` always returns a new instance, even if it results in
     * not filtering out any values.
     */
    filter<F extends T>(
      predicate: (value: T, index: number, iter: this) => value is F,
      context?: unknown
    ): Collection.Indexed<F>;
    filter(
      predicate: (value: T, index: number, iter: this) => unknown,
      context?: unknown
    ): this;

    [Symbol.iterator](): IterableIterator<T>;
  }

  /**
   * Set Collections only represent values. They have no associated keys or
   * indices. Duplicate values are possible in the lazy `Seq.Set`s, however
   * the concrete `Set` Collection does not allow duplicate values.
   *
   * Collection methods on Collection.Set such as `map` and `forEach` will provide
   * the value as both the first and second arguments to the provided function.
   *
   * ```js
   * const { Collection } = require('immutable')
   * const seq = Collection.Set([ 'A', 'B', 'C' ])
   * // Seq { "A", "B", "C" }
   * seq.forEach((v, k) =>
   *  assert.equal(v, k)
   * )
   * ```
   */
  namespace Set {}

  /**
   * Similar to `Collection()`, but always returns a Collection.Set.
   *
   * Note: `Collection.Set` is a factory function and not a class, and does
   * not use the `new` keyword during construction.
   */
  function Set<T>(collection?: Iterable<T> | ArrayLike<T>): Collection.Set<T>;

  interface Set<T> extends Collection<T, T> {
    /**
     * Deeply converts this Set collection to equivalent native JavaScript Array.
     */
    toJS(): Array<unknown>;

    /**
     * Shallowly converts this Set collection to equivalent native JavaScript Array.
     */
    toJSON(): Array<T>;

    /**
     * Shallowly converts this collection to an Array.
     */
    toArray(): Array<T>;

    /**
     * Returns Seq.Set.
     * @override
     */
    toSeq(): Seq.Set<T>;

    // Sequence algorithms

    /**
     * Returns a new Collection with other collections concatenated to this one.
     */
    concat<U>(...collections: Array<Iterable<U>>): Collection.Set<T | U>;

    /**
     * Returns a new Collection.Set with values passed through a
     * `mapper` function.
     *
     * ```
     * Collection.Set([ 1, 2 ]).map(x => 10 * x)
     * // Seq { 1, 2 }
     * ```
     *
     * Note: `map()` always returns a new instance, even if it produced the
     * same value at every step.
     */
    map<M>(
      mapper: (value: T, key: T, iter: this) => M,
      context?: unknown
    ): Collection.Set<M>;

    /**
     * Flat-maps the Collection, returning a Collection of the same type.
     *
     * Similar to `collection.map(...).flatten(true)`.
     */
    flatMap<M>(
      mapper: (value: T, key: T, iter: this) => Iterable<M>,
      context?: unknown
    ): Collection.Set<M>;

    /**
     * Returns a new Collection with only the values for which the `predicate`
     * function returns true.
     *
     * Note: `filter()` always returns a new instance, even if it results in
     * not filtering out any values.
     */
    filter<F extends T>(
      predicate: (value: T, key: T, iter: this) => value is F,
      context?: unknown
    ): Collection.Set<F>;
    filter(
      predicate: (value: T, key: T, iter: this) => unknown,
      context?: unknown
    ): this;

    [Symbol.iterator](): IterableIterator<T>;
  }
}

/**
 * Creates a Collection.
 *
 * The type of Collection created is based on the input.
 *
 *   * If an `Collection`, that same `Collection`.
 *   * If an Array-like, an `Collection.Indexed`.
 *   * If an Object with an Iterator defined, an `Collection.Indexed`.
 *   * If an Object, an `Collection.Keyed`.
 *
 * This methods forces the conversion of Objects and Strings to Collections.
 * If you want to ensure that a Collection of one item is returned, use
 * `Seq.of`.
 *
 * Note: An Iterator itself will be treated as an object, becoming a `Seq.Keyed`,
 * which is usually not what you want. You should turn your Iterator Object into
 * an iterable object by defining a Symbol.iterator (or @@iterator) method which
 * returns `this`.
 *
 * Note: `Collection` is a conversion function and not a class, and does not
 * use the `new` keyword during construction.
 */
function Collection<I extends Collection<unknown, unknown>>(collection: I): I;
function Collection<T>(
  collection: Iterable<T> | ArrayLike<T>
): Collection.Indexed<T>;
function Collection<V>(obj: { [key: string]: V }): Collection.Keyed<string, V>;
function Collection<K = unknown, V = unknown>(): Collection<K, V>;

interface Collection<K, V> extends ValueObject {
  // Value equality

  /**
   * True if this and the other Collection have value equality, as defined
   * by `Immutable.is()`.
   *
   * Note: This is equivalent to `Immutable.is(this, other)`, but provided to
   * allow for chained expressions.
   */
  equals(other: unknown): boolean;

  /**
   * Computes and returns the hashed identity for this Collection.
   *
   * The `hashCode` of a Collection is used to determine potential equality,
   * and is used when adding this to a `Set` or as a key in a `Map`, enabling
   * lookup via a different instance.
   *
   * <!-- runkit:activate
   *      { "preamble": "const { Set,  List } = require('immutable')" }
   * -->
   * ```js
   * const a = List([ 1, 2, 3 ]);
   * const b = List([ 1, 2, 3 ]);
   * assert.notStrictEqual(a, b); // different instances
   * const set = Set([ a ]);
   * assert.equal(set.has(b), true);
   * ```
   *
   * If two values have the same `hashCode`, they are [not guaranteed
   * to be equal][Hash Collision]. If two values have different `hashCode`s,
   * they must not be equal.
   *
   * [Hash Collision]: https://en.wikipedia.org/wiki/Collision_(computer_science)
   */
  hashCode(): number;

  // Reading values

  /**
   * Returns the value associated with the provided key, or notSetValue if
   * the Collection does not contain this key.
   *
   * Note: it is possible a key may be associated with an `undefined` value,
   * so if `notSetValue` is not provided and this method returns `undefined`,
   * that does not guarantee the key was not found.
   */
  get<NSV>(key: K, notSetValue: NSV): V | NSV;
  get(key: K): V | undefined;

  /**
   * True if a key exists within this `Collection`, using `Immutable.is`
   * to determine equality
   */
  has(key: K): boolean;

  /**
   * True if a value exists within this `Collection`, using `Immutable.is`
   * to determine equality
   * @alias contains
   */
  includes(value: V): boolean;
  contains(value: V): boolean;

  /**
   * In case the `Collection` is not empty returns the first element of the
   * `Collection`.
   * In case the `Collection` is empty returns the optional default
   * value if provided, if no default value is provided returns undefined.
   */
  first<NSV = undefined>(notSetValue?: NSV): V | NSV;

  /**
   * In case the `Collection` is not empty returns the last element of the
   * `Collection`.
   * In case the `Collection` is empty returns the optional default
   * value if provided, if no default value is provided returns undefined.
   */
  last<NSV = undefined>(notSetValue?: NSV): V | NSV;

  // Reading deep values

  /**
   * Returns the value found by following a path of keys or indices through
   * nested Collections.
   *
   * <!-- runkit:activate -->
   * ```js
   * const { Map, List } = require('immutable')
   * const deepData = Map({ x: List([ Map({ y: 123 }) ]) });
   * deepData.getIn(['x', 0, 'y']) // 123
   * ```
   *
   * Plain JavaScript Object or Arrays may be nested within an Immutable.js
   * Collection, and getIn() can access those values as well:
   *
   * <!-- runkit:activate -->
   * ```js
   * const { Map, List } = require('immutable')
   * const deepData = Map({ x: [ { y: 123 } ] });
   * deepData.getIn(['x', 0, 'y']) // 123
   * ```
   */
  getIn(searchKeyPath: Iterable<unknown>, notSetValue?: unknown): unknown;

  /**
   * True if the result of following a path of keys or indices through nested
   * Collections results in a set value.
   */
  hasIn(searchKeyPath: Iterable<unknown>): boolean;

  // Persistent changes

  /**
   * This can be very useful as a way to "chain" a normal function into a
   * sequence of methods. RxJS calls this "let" and lodash calls it "thru".
   *
   * For example, to sum a Seq after mapping and filtering:
   *
   * <!-- runkit:activate -->
   * ```js
   * const { Seq } = require('immutable')
   *
   * function sum(collection) {
   *   return collection.reduce((sum, x) => sum + x, 0)
   * }
   *
   * Seq([ 1, 2, 3 ])
   *   .map(x => x + 1)
   *   .filter(x => x % 2 === 0)
   *   .update(sum)
   * // 6
   * ```
   */
  update<R>(updater: (value: this) => R): R;

  // Conversion to JavaScript types

  /**
   * Deeply converts this Collection to equivalent native JavaScript Array or Object.
   *
   * `Collection.Indexed`, and `Collection.Set` become `Array`, while
   * `Collection.Keyed` become `Object`, converting keys to Strings.
   */
  toJS(): Array<unknown> | { [key: string]: unknown };

  /**
   * Shallowly converts this Collection to equivalent native JavaScript Array or Object.
   *
   * `Collection.Indexed`, and `Collection.Set` become `Array`, while
   * `Collection.Keyed` become `Object`, converting keys to Strings.
   */
  toJSON(): Array<V> | { [key: string]: V };

  /**
   * Shallowly converts this collection to an Array.
   *
   * `Collection.Indexed`, and `Collection.Set` produce an Array of values.
   * `Collection.Keyed` produce an Array of [key, value] tuples.
   */
  toArray(): Array<V> | Array<[K, V]>;

  /**
   * Shallowly converts this Collection to an Object.
   *
   * Converts keys to Strings.
   */
  toObject(): { [key: string]: V };

  // Conversion to Collections

  /**
   * Converts this Collection to a Map, Throws if keys are not hashable.
   *
   * Note: This is equivalent to `Map(this.toKeyedSeq())`, but provided
   * for convenience and to allow for chained expressions.
   */
  toMap(): Map<K, V>;

  // Conversion to Seq

  /**
   * Converts this Collection to a Seq of the same kind (indexed,
   * keyed, or set).
   */
  toSeq(): Seq<K, V>;

  /**
   * Returns a Seq.Keyed from this Collection where indices are treated as keys.
   *
   * This is useful if you want to operate on an
   * Collection.Indexed and preserve the [index, value] pairs.
   *
   * The returned Seq will have identical iteration order as
   * this Collection.
   *
   * <!-- runkit:activate -->
   * ```js
   * const { Seq } = require('immutable')
   * const indexedSeq = Seq([ 'A', 'B', 'C' ])
   * // Seq [ "A", "B", "C" ]
   * indexedSeq.filter(v => v === 'B')
   * // Seq [ "B" ]
   * const keyedSeq = indexedSeq.toKeyedSeq()
   * // Seq { 0: "A", 1: "B", 2: "C" }
   * keyedSeq.filter(v => v === 'B')
   * // Seq { 1: "B" }
   * ```
   */
  toKeyedSeq(): Seq.Keyed<K, V>;

  /**
   * Returns an Seq.Indexed of the values of this Collection, discarding keys.
   */
  toIndexedSeq(): Seq.Indexed<V>;

  /**
   * Returns a Seq.Set of the values of this Collection, discarding keys.
   */
  toSetSeq(): Seq.Set<V>;

  // Iterators

  /**
   * An iterator of this `Collection`'s keys.
   *
   * Note: this will return an ES6 iterator which does not support
   * Immutable.js sequence algorithms. Use `keySeq` instead, if this is
   * what you want.
   */
  keys(): IterableIterator<K>;

  /**
   * An iterator of this `Collection`'s values.
   *
   * Note: this will return an ES6 iterator which does not support
   * Immutable.js sequence algorithms. Use `valueSeq` instead, if this is
   * what you want.
   */
  values(): IterableIterator<V>;

  /**
   * An iterator of this `Collection`'s entries as `[ key, value ]` tuples.
   *
   * Note: this will return an ES6 iterator which does not support
   * Immutable.js sequence algorithms. Use `entrySeq` instead, if this is
   * what you want.
   */
  entries(): IterableIterator<[K, V]>;

  [Symbol.iterator](): IterableIterator<unknown>;

  // Collections (Seq)

  /**
   * Returns a new Seq.Indexed of the keys of this Collection,
   * discarding values.
   */
  keySeq(): Seq.Indexed<K>;

  /**
   * Returns an Seq.Indexed of the values of this Collection, discarding keys.
   */
  valueSeq(): Seq.Indexed<V>;

  /**
   * Returns a new Seq.Indexed of [key, value] tuples.
   */
  entrySeq(): Seq.Indexed<[K, V]>;

  // Sequence algorithms

  /**
   * Returns a new Collection of the same type with values passed through a
   * `mapper` function.
   *
   * <!-- runkit:activate -->
   * ```js
   * const { Collection } = require('immutable')
   * Collection({ a: 1, b: 2 }).map(x => 10 * x)
   * // Seq { "a": 10, "b": 20 }
   * ```
   *
   * Note: `map()` always returns a new instance, even if it produced the same
   * value at every step.
   */
  map<M>(
    mapper: (value: V, key: K, iter: this) => M,
    context?: unknown
  ): Collection<K, M>;

  /**
   * Note: used only for sets, which return Collection<M, M> but are otherwise
   * identical to normal `map()`.
   *
   * @ignore
   */
  map(...args: Array<never>): unknown;

  /**
   * Returns a new Collection of the same type with only the entries for which
   * the `predicate` function returns true.
   *
   * <!-- runkit:activate -->
   * ```js
   * const { Map } = require('immutable')
   * Map({ a: 1, b: 2, c: 3, d: 4}).filter(x => x % 2 === 0)
   * // Map { "b": 2, "d": 4 }
   * ```
   *
   * Note: `filter()` always returns a new instance, even if it results in
   * not filtering out any values.
   */
  filter<F extends V>(
    predicate: (value: V, key: K, iter: this) => value is F,
    context?: unknown
  ): Collection<K, F>;
  filter(
    predicate: (value: V, key: K, iter: this) => unknown,
    context?: unknown
  ): this;

  /**
   * Returns a new Collection of the same type with only the entries for which
   * the `predicate` function returns false.
   *
   * <!-- runkit:activate -->
   * ```js
   * const { Map } = require('immutable')
   * Map({ a: 1, b: 2, c: 3, d: 4}).filterNot(x => x % 2 === 0)
   * // Map { "a": 1, "c": 3 }
   * ```
   *
   * Note: `filterNot()` always returns a new instance, even if it results in
   * not filtering out any values.
   */
  filterNot(
    predicate: (value: V, key: K, iter: this) => boolean,
    context?: unknown
  ): this;

  /**
   * Returns a new Collection of the same type in reverse order.
   */
  reverse(): this;

  /**
   * Returns a new Collection of the same type which includes the same entries,
   * stably sorted by using a `comparator`.
   *
   * If a `comparator` is not provided, a default comparator uses `<` and `>`.
   *
   * `comparator(valueA, valueB)`:
   *
   *   * Returns `0` if the elements should not be swapped.
   *   * Returns `-1` (or any negative number) if `valueA` comes before `valueB`
   *   * Returns `1` (or any positive number) if `valueA` comes after `valueB`
   *   * Is pure, i.e. it must always return the same value for the same pair
   *     of values.
   *
   * When sorting collections which have no defined order, their ordered
   * equivalents will be returned. e.g. `map.sort()` returns OrderedMap.
   *
   * <!-- runkit:activate -->
   * ```js
   * const { Map } = require('immutable')
   * Map({ "c": 3, "a": 1, "b": 2 }).sort((a, b) => {
   *   if (a < b) { return -1; }
   *   if (a > b) { return 1; }
   *   if (a === b) { return 0; }
   * });
   * // OrderedMap { "a": 1, "b": 2, "c": 3 }
   * ```
   *
   * Note: `sort()` Always returns a new instance, even if the original was
   * already sorted.
   *
   * Note: This is always an eager operation.
   */
  sort(comparator?: (valueA: V, valueB: V) => number): this;

  /**
   * Like `sort`, but also accepts a `comparatorValueMapper` which allows for
   * sorting by more sophisticated means:
   *
   * <!-- runkit:activate -->
   * ```js
   * const { Map } = require('immutable')
   * const beattles = Map({
   *   John: { name: "Lennon" },
   *   Paul: { name: "McCartney" },
   *   George: { name: "Harrison" },
   *   Ringo: { name: "Starr" },
   * });
   * beattles.sortBy(member => member.name);
   * ```
   *
   * Note: `sortBy()` Always returns a new instance, even if the original was
   * already sorted.
   *
   * Note: This is always an eager operation.
   */
  sortBy<C>(
    comparatorValueMapper: (value: V, key: K, iter: this) => C,
    comparator?: (valueA: C, valueB: C) => number
  ): this;

  /**
   * Returns a `Collection.Keyed` of `Collection.Keyeds`, grouped by the return
   * value of the `grouper` function.
   *
   * Note: This is always an eager operation.
   *
   * <!-- runkit:activate -->
   * ```js
   * const { List, Map } = require('immutable')
   * const listOfMaps = List([
   *   Map({ v: 0 }),
   *   Map({ v: 1 }),
   *   Map({ v: 1 }),
   *   Map({ v: 0 }),
   *   Map({ v: 2 })
   * ])
   * const groupsOfMaps = listOfMaps.groupBy(x => x.get('v'))
   * // Map {
   * //   0: List [ Map{ "v": 0 }, Map { "v": 0 } ],
   * //   1: List [ Map{ "v": 1 }, Map { "v": 1 } ],
   * //   2: List [ Map{ "v": 2 } ],
   * // }
   * ```
   */
  groupBy<G>(
    grouper: (value: V, key: K, iter: this) => G,
    context?: unknown
  ): /*Map*/ Seq.Keyed<G, /*this*/ Collection<K, V>>;

  // Side effects

  /**
   * The `sideEffect` is executed for every entry in the Collection.
   *
   * Unlike `Array#forEach`, if any call of `sideEffect` returns
   * `false`, the iteration will stop. Returns the number of entries iterated
   * (including the last iteration which returned false).
   */
  forEach(
    sideEffect: (value: V, key: K, iter: this) => unknown,
    context?: unknown
  ): number;

  // Creating subsets

  /**
   * Returns a new Collection of the same type representing a portion of this
   * Collection from start up to but not including end.
   *
   * If begin is negative, it is offset from the end of the Collection. e.g.
   * `slice(-2)` returns a Collection of the last two entries. If it is not
   * provided the new Collection will begin at the beginning of this Collection.
   *
   * If end is negative, it is offset from the end of the Collection. e.g.
   * `slice(0, -1)` returns a Collection of everything but the last entry. If
   * it is not provided, the new Collection will continue through the end of
   * this Collection.
   *
   * If the requested slice is equivalent to the current Collection, then it
   * will return itself.
   */
  slice(begin?: number, end?: number): this;

  /**
   * Returns a new Collection of the same type containing all entries except
   * the first.
   */
  rest(): this;

  /**
   * Returns a new Collection of the same type containing all entries except
   * the last.
   */
  butLast(): this;

  /**
   * Returns a new Collection of the same type which excludes the first `amount`
   * entries from this Collection.
   */
  skip(amount: number): this;

  /**
   * Returns a new Collection of the same type which excludes the last `amount`
   * entries from this Collection.
   */
  skipLast(amount: number): this;

  /**
   * Returns a new Collection of the same type which includes entries starting
   * from when `predicate` first returns false.
   *
   * <!-- runkit:activate -->
   * ```js
   * const { List } = require('immutable')
   * List([ 'dog', 'frog', 'cat', 'hat', 'god' ])
   *   .skipWhile(x => x.match(/g/))
   * // List [ "cat", "hat", "god" ]
   * ```
   */
  skipWhile(
    predicate: (value: V, key: K, iter: this) => boolean,
    context?: unknown
  ): this;

  /**
   * Returns a new Collection of the same type which includes entries starting
   * from when `predicate` first returns true.
   *
   * <!-- runkit:activate -->
   * ```js
   * const { List } = require('immutable')
   * List([ 'dog', 'frog', 'cat', 'hat', 'god' ])
   *   .skipUntil(x => x.match(/hat/))
   * // List [ "hat", "god" ]
   * ```
   */
  skipUntil(
    predicate: (value: V, key: K, iter: this) => boolean,
    context?: unknown
  ): this;

  /**
   * Returns a new Collection of the same type which includes the first `amount`
   * entries from this Collection.
   */
  take(amount: number): this;

  /**
   * Returns a new Collection of the same type which includes the last `amount`
   * entries from this Collection.
   */
  takeLast(amount: number): this;

  /**
   * Returns a new Collection of the same type which includes entries from this
   * Collection as long as the `predicate` returns true.
   *
   * <!-- runkit:activate -->
   * ```js
   * const { List } = require('immutable')
   * List([ 'dog', 'frog', 'cat', 'hat', 'god' ])
   *   .takeWhile(x => x.match(/o/))
   * // List [ "dog", "frog" ]
   * ```
   */
  takeWhile(
    predicate: (value: V, key: K, iter: this) => boolean,
    context?: unknown
  ): this;

  /**
   * Returns a new Collection of the same type which includes entries from this
   * Collection as long as the `predicate` returns false.
   *
   * <!-- runkit:activate -->
   * ```js
   * const { List } = require('immutable')
   * List([ 'dog', 'frog', 'cat', 'hat', 'god' ])
   *   .takeUntil(x => x.match(/at/))
   * // List [ "dog", "frog" ]
   * ```
   */
  takeUntil(
    predicate: (value: V, key: K, iter: this) => boolean,
    context?: unknown
  ): this;

  // Combination

  /**
   * Returns a new Collection of the same type with other values and
   * collection-like concatenated to this one.
   *
   * For Seqs, all entries will be present in the resulting Seq, even if they
   * have the same key.
   */
  concat(...valuesOrCollections: Array<unknown>): Collection<unknown, unknown>;

  /**
   * Flattens nested Collections.
   *
   * Will deeply flatten the Collection by default, returning a Collection of the
   * same type, but a `depth` can be provided in the form of a number or
   * boolean (where true means to shallowly flatten one level). A depth of 0
   * (or shallow: false) will deeply flatten.
   *
   * Flattens only others Collection, not Arrays or Objects.
   *
   * Note: `flatten(true)` operates on Collection<unknown, Collection<K, V>> and
   * returns Collection<K, V>
   */
  flatten(depth?: number): Collection<unknown, unknown>;
  // tslint:disable-next-line unified-signatures
  flatten(shallow?: boolean): Collection<unknown, unknown>;

  /**
   * Flat-maps the Collection, returning a Collection of the same type.
   *
   * Similar to `collection.map(...).flatten(true)`.
   */
  flatMap<M>(
    mapper: (value: V, key: K, iter: this) => Iterable<M>,
    context?: unknown
  ): Collection<K, M>;

  /**
   * Flat-maps the Collection, returning a Collection of the same type.
   *
   * Similar to `collection.map(...).flatten(true)`.
   * Used for Dictionaries only.
   */
  flatMap<KM, VM>(
    mapper: (value: V, key: K, iter: this) => Iterable<[KM, VM]>,
    context?: unknown
  ): Collection<KM, VM>;

  // Reducing a value

  /**
   * Reduces the Collection to a value by calling the `reducer` for every entry
   * in the Collection and passing along the reduced value.
   *
   * If `initialReduction` is not provided, the first item in the
   * Collection will be used.
   *
   * @see `Array#reduce`.
   */
  reduce<R>(
    reducer: (reduction: R, value: V, key: K, iter: this) => R,
    initialReduction: R,
    context?: unknown
  ): R;
  reduce<R>(reducer: (reduction: V | R, value: V, key: K, iter: this) => R): R;

  /**
   * Reduces the Collection in reverse (from the right side).
   *
   * Note: Similar to this.reverse().reduce(), and provided for parity
   * with `Array#reduceRight`.
   */
  reduceRight<R>(
    reducer: (reduction: R, value: V, key: K, iter: this) => R,
    initialReduction: R,
    context?: unknown
  ): R;
  reduceRight<R>(
    reducer: (reduction: V | R, value: V, key: K, iter: this) => R
  ): R;

  /**
   * True if `predicate` returns true for all entries in the Collection.
   */
  every(
    predicate: (value: V, key: K, iter: this) => boolean,
    context?: unknown
  ): boolean;

  /**
   * True if `predicate` returns true for any entry in the Collection.
   */
  some(
    predicate: (value: V, key: K, iter: this) => boolean,
    context?: unknown
  ): boolean;

  /**
   * Joins values together as a string, inserting a separator between each.
   * The default separator is `","`.
   */
  join(separator?: string): string;

  /**
   * Returns true if this Collection includes no values.
   *
   * For some lazy `Seq`, `isEmpty` might need to iterate to determine
   * emptiness. At most one iteration will occur.
   */
  isEmpty(): boolean;

  /**
   * Returns the size of this Collection.
   *
   * Regardless of if this Collection can describe its size lazily (some Seqs
   * cannot), this method will always return the correct size. E.g. it
   * evaluates a lazy `Seq` if necessary.
   *
   * If `predicate` is provided, then this returns the count of entries in the
   * Collection for which the `predicate` returns true.
   */
  count(): number;
  count(
    predicate: (value: V, key: K, iter: this) => boolean,
    context?: unknown
  ): number;

  /**
   * Returns a `Seq.Keyed` of counts, grouped by the return value of
   * the `grouper` function.
   *
   * Note: This is not a lazy operation.
   */
  countBy<G>(
    grouper: (value: V, key: K, iter: this) => G,
    context?: unknown
  ): Map<G, number>;

  // Search for value

  /**
   * Returns the first value for which the `predicate` returns true.
   */
  find(
    predicate: (value: V, key: K, iter: this) => boolean,
    context?: unknown,
    notSetValue?: V
  ): V | undefined;

  /**
   * Returns the last value for which the `predicate` returns true.
   *
   * Note: `predicate` will be called for each entry in reverse.
   */
  findLast(
    predicate: (value: V, key: K, iter: this) => boolean,
    context?: unknown,
    notSetValue?: V
  ): V | undefined;

  /**
   * Returns the first [key, value] entry for which the `predicate` returns true.
   */
  findEntry(
    predicate: (value: V, key: K, iter: this) => boolean,
    context?: unknown,
    notSetValue?: V
  ): [K, V] | undefined;

  /**
   * Returns the last [key, value] entry for which the `predicate`
   * returns true.
   *
   * Note: `predicate` will be called for each entry in reverse.
   */
  findLastEntry(
    predicate: (value: V, key: K, iter: this) => boolean,
    context?: unknown,
    notSetValue?: V
  ): [K, V] | undefined;

  /**
   * Returns the key for which the `predicate` returns true.
   */
  findKey(
    predicate: (value: V, key: K, iter: this) => boolean,
    context?: unknown
  ): K | undefined;

  /**
   * Returns the last key for which the `predicate` returns true.
   *
   * Note: `predicate` will be called for each entry in reverse.
   */
  findLastKey(
    predicate: (value: V, key: K, iter: this) => boolean,
    context?: unknown
  ): K | undefined;

  /**
   * Returns the key associated with the search value, or undefined.
   */
  keyOf(searchValue: V): K | undefined;

  /**
   * Returns the last key associated with the search value, or undefined.
   */
  lastKeyOf(searchValue: V): K | undefined;

  /**
   * Returns the maximum value in this collection. If any values are
   * comparatively equivalent, the first one found will be returned.
   *
   * The `comparator` is used in the same way as `Collection#sort`. If it is not
   * provided, the default comparator is `>`.
   *
   * When two values are considered equivalent, the first encountered will be
   * returned. Otherwise, `max` will operate independent of the order of input
   * as long as the comparator is commutative. The default comparator `>` is
   * commutative *only* when types do not differ.
   *
   * If `comparator` returns 0 and either value is NaN, undefined, or null,
   * that value will be returned.
   */
  max(comparator?: (valueA: V, valueB: V) => number): V | undefined;

  /**
   * Like `max`, but also accepts a `comparatorValueMapper` which allows for
   * comparing by more sophisticated means:
   *
   * <!-- runkit:activate -->
   * ```js
   * const { List, } = require('immutable');
   * const l = List([
   *   { name: 'Bob', avgHit: 1 },
   *   { name: 'Max', avgHit: 3 },
   *   { name: 'Lili', avgHit: 2 } ,
   * ]);
   * l.maxBy(i => i.avgHit); // will output { name: 'Max', avgHit: 3 }
   * ```
   */
  maxBy<C>(
    comparatorValueMapper: (value: V, key: K, iter: this) => C,
    comparator?: (valueA: C, valueB: C) => number
  ): V | undefined;

  /**
   * Returns the minimum value in this collection. If any values are
   * comparatively equivalent, the first one found will be returned.
   *
   * The `comparator` is used in the same way as `Collection#sort`. If it is not
   * provided, the default comparator is `<`.
   *
   * When two values are considered equivalent, the first encountered will be
   * returned. Otherwise, `min` will operate independent of the order of input
   * as long as the comparator is commutative. The default comparator `<` is
   * commutative *only* when types do not differ.
   *
   * If `comparator` returns 0 and either value is NaN, undefined, or null,
   * that value will be returned.
   */
  min(comparator?: (valueA: V, valueB: V) => number): V | undefined;

  /**
   * Like `min`, but also accepts a `comparatorValueMapper` which allows for
   * comparing by more sophisticated means:
   *
   * <!-- runkit:activate -->
   * ```js
   * const { List, } = require('immutable');
   * const l = List([
   *   { name: 'Bob', avgHit: 1 },
   *   { name: 'Max', avgHit: 3 },
   *   { name: 'Lili', avgHit: 2 } ,
   * ]);
   * l.minBy(i => i.avgHit); // will output { name: 'Bob', avgHit: 1 }
   * ```
   */
  minBy<C>(
    comparatorValueMapper: (value: V, key: K, iter: this) => C,
    comparator?: (valueA: C, valueB: C) => number
  ): V | undefined;

  // Comparison

  /**
   * True if `iter` includes every value in this Collection.
   */
  isSubset(iter: Iterable<V>): boolean;

  /**
   * True if this Collection includes every value in `iter`.
   */
  isSuperset(iter: Iterable<V>): boolean;
}

/**
 * The interface to fulfill to qualify as a Value Object.
 */
interface ValueObject {
  /**
   * True if this and the other Collection have value equality, as defined
   * by `Immutable.is()`.
   *
   * Note: This is equivalent to `Immutable.is(this, other)`, but provided to
   * allow for chained expressions.
   */
  equals(other: unknown): boolean;

  /**
   * Computes and returns the hashed identity for this Collection.
   *
   * The `hashCode` of a Collection is used to determine potential equality,
   * and is used when adding this to a `Set` or as a key in a `Map`, enabling
   * lookup via a different instance.
   *
   * <!-- runkit:activate -->
   * ```js
   * const { List, Set } = require('immutable');
   * const a = List([ 1, 2, 3 ]);
   * const b = List([ 1, 2, 3 ]);
   * assert.notStrictEqual(a, b); // different instances
   * const set = Set([ a ]);
   * assert.equal(set.has(b), true);
   * ```
   *
   * Note: hashCode() MUST return a Uint32 number. The easiest way to
   * guarantee this is to return `myHash | 0` from a custom implementation.
   *
   * If two values have the same `hashCode`, they are [not guaranteed
   * to be equal][Hash Collision]. If two values have different `hashCode`s,
   * they must not be equal.
   *
   * Note: `hashCode()` is not guaranteed to always be called before
   * `equals()`. Most but not all Immutable.js collections use hash codes to
   * organize their internal data structures, while all Immutable.js
   * collections use equality during lookups.
   *
   * [Hash Collision]: https://en.wikipedia.org/wiki/Collision_(computer_science)
   */
  hashCode(): number;
}

/**
 * Defines the main export of the immutable module to be the Immutable namespace
 * This supports many common module import patterns:
 *
 *     const Immutable = require("immutable");
 *     const { List } = require("immutable");
 *     import Immutable from "immutable";
 *     import * as Immutable from "immutable";
 *     import { List } from "immutable";
 *
 */
export = Map;
