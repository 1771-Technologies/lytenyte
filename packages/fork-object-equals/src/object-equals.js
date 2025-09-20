const {
  getOwnPropertySymbols,
  keys,
  prototype: { hasOwnProperty, toString },
} = Object;
const spliceArray = Array.prototype.splice,
  isTypedArray = ArrayBuffer.isView;

const REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element");

const isBrowserOrWebWorker =
  (typeof window === "object" || typeof self === "object") &&
  typeof navigator === "object" &&
  typeof navigator.userAgent === "string";

const isV8 =
  globalThis.chrome === "object" ||
  (isBrowserOrWebWorker && navigator.userAgent.search(/chrome/i) > -1);

const isJSC =
  globalThis.$?.IsHTMLDDA !== undefined ||
  (isBrowserOrWebWorker && navigator.userAgent.match(/^(?!.*(chrome|crios)).*safari/i) !== null);

export function objectEqualsCore(
  target,
  source,
  circular,
  crossrealm,
  react,
  symbols,
  fallback,
  cache,
) {
  if (typeof target === "object" && typeof source === "object") {
    if (!crossrealm) {
      if (target == null || source == null) return target === source;
      var tor = target.constructor;
      if (
        tor !== source.constructor &&
        !hasOwnProperty.call(target, "constructor") &&
        !hasOwnProperty.call(source, "constructor")
      )
        return false;
    }
    if (react && target.$$typeof === REACT_ELEMENT_TYPE && source.$$typeof === REACT_ELEMENT_TYPE)
      return (
        target.type === source.type &&
        target.key === source.key &&
        target.ref === source.ref &&
        objectEqualsCore(
          target.props,
          source.props,
          circular,
          crossrealm,
          react,
          symbols,
          fallback,
          cache,
        )
      );
    if (circular) {
      let cached = cache.get(target);
      if (cached !== undefined) return cached === source;
      cached = cache.get(source);
      if (cached !== undefined) return cached === target;
      cache.set(target, source).set(source, target);
    }
    while (true) {
      if (tor !== undefined) {
        if (tor === Object) {
          const targetKeys = keys(target),
            targetLength = targetKeys.length;
          if (targetLength !== keys(source).length) return false;
          if ((isV8 && targetLength > 1 && targetLength < 20) || (isJSC && targetLength < 66))
            for (const key in target) {
              if (!hasOwnProperty.call(target, key)) continue;
              const sourceValue = source[key];
              if (sourceValue === undefined && !hasOwnProperty.call(source, key)) return false;
              const targetValue = target[key];
              if (
                targetValue === sourceValue ||
                objectEqualsCore(
                  targetValue,
                  sourceValue,
                  circular,
                  crossrealm,
                  react,
                  symbols,
                  fallback,
                  cache,
                )
              )
                continue;
              return false;
            }
          else
            for (let index = targetLength - 1; index >= 0; index--) {
              const key = targetKeys[index],
                sourceValue = source[key];
              if (sourceValue === undefined && !hasOwnProperty.call(source, key)) return false;
              const targetValue = target[key];
              if (
                targetValue === sourceValue ||
                objectEqualsCore(
                  targetValue,
                  sourceValue,
                  circular,
                  crossrealm,
                  react,
                  symbols,
                  fallback,
                  cache,
                )
              )
                continue;
              return false;
            }
          if (symbols) {
            const targetSymbols = getOwnPropertySymbols(target),
              targetLength = targetSymbols.length;
            if (targetLength !== getOwnPropertySymbols(source).length) return false;
            for (let index = targetLength - 1; index >= 0; index--) {
              const symbol = targetSymbols[index],
                sourceValue = source[symbol];
              if (sourceValue === undefined && !hasOwnProperty.call(source, symbol)) return false;
              const targetValue = target[symbol];
              if (
                targetValue === sourceValue ||
                objectEqualsCore(
                  targetValue,
                  sourceValue,
                  circular,
                  crossrealm,
                  react,
                  symbols,
                  fallback,
                  cache,
                )
              )
                continue;
              return false;
            }
          }
          return true;
        }
        if (tor === Array) {
          const targetLength = target.length;
          if (targetLength !== source.length) return false;
          for (let index = targetLength - 1; index >= 0; index--) {
            if (
              target[index] === source[index] ||
              objectEqualsCore(
                target[index],
                source[index],
                circular,
                crossrealm,
                react,
                symbols,
                fallback,
                cache,
              )
            )
              continue;
            return false;
          }
          return true;
        }
        if (tor === DataView) {
          const targetLength = target.byteLength;
          if (targetLength !== source.byteLength) return false;
          const alignedOffset = targetLength & ~3;
          if (alignedOffset)
            for (let index = alignedOffset - 4; index >= 0; index -= 4)
              if (target.getInt32(index) !== source.getInt32(index)) return false;
          for (let index = targetLength - 1; index >= alignedOffset; index--)
            if (target.getInt8(index) !== source.getInt8(index)) return false;
          return true;
        }
        if (tor === ArrayBuffer || tor === SharedArrayBuffer) {
          target = new Uint8Array(target);
          source = new Uint8Array(source);
          tor = Uint8Array;
        }
        if (tor === Uint8Array || isTypedArray(target)) {
          const targetLength = target.length;
          if (targetLength !== source.length) return false;
          const alignedOffset = targetLength > 64 ? targetLength & ~3 : 0;
          if (alignedOffset) {
            const length = (targetLength / 4) | 0;
            const targetTypedArray = new Int32Array(target.buffer, target.byteOffset, length);
            const sourceTypedArray = new Int32Array(source.buffer, source.byteOffset, length);
            for (let index = length - 1; index >= 0; index--)
              if (targetTypedArray[index] !== sourceTypedArray[index]) return false;
          }
          for (let index = targetLength - 1; index >= alignedOffset; index--)
            if (target[index] !== source[index]) return false;
          return true;
        }
        if (tor === Map) {
          if (target.size !== source.size) return false;
          for (const { 0: targetKey, 1: targetValue } of target.entries()) {
            const sourceValue = source.get(targetKey);
            if (sourceValue === undefined && !source.has(targetKey)) return false;
            if (
              targetValue === sourceValue ||
              objectEqualsCore(
                targetValue,
                sourceValue,
                circular,
                crossrealm,
                react,
                symbols,
                fallback,
                cache,
              )
            )
              continue;
            return false;
          }
          return true;
        }
        if (tor === Set) {
          if (target.size !== source.size) return false;
          const targetValues = [];
          for (const targetValue of target.values()) {
            if (source.has(targetValue)) continue;
            if (typeof targetValue !== "object") return false;
            targetValues.push(targetValue);
          }
          const targetLength = targetValues.length;
          if (targetLength === 0) return true;
          const sourceValues = [];
          for (const sourceValue of source.values())
            if (sourceValue !== null && typeof sourceValue === "object")
              sourceValues.push(sourceValue);
          if (targetLength !== sourceValues.length) return false;
          if (targetLength === 1)
            return objectEqualsCore(
              targetValues[0],
              sourceValues[0],
              circular,
              crossrealm,
              react,
              symbols,
              fallback,
              cache,
            );
          lo: for (let targetIdx = targetLength - 1; targetIdx >= 0; targetIdx--) {
            for (let sourceIdx = sourceValues.length - 1; sourceIdx >= 0; sourceIdx--) {
              if (
                objectEqualsCore(
                  targetValues[targetIdx],
                  sourceValues[sourceIdx],
                  circular,
                  crossrealm,
                  react,
                  symbols,
                  fallback,
                  cache,
                )
              ) {
                spliceArray.call(sourceValues, sourceIdx, 1);
                continue lo;
              }
            }
            return false;
          }
          return true;
        }
        if (tor === Date) {
          const targetTime = target.getTime(),
            sourceTime = source.getTime();
          return (
            targetTime === sourceTime || (targetTime !== targetTime && sourceTime !== sourceTime)
          );
        }
        if (tor === RegExp)
          return (
            target.source === source.source &&
            target.flags === source.flags &&
            target.lastIndex === source.lastIndex
          );
        if (tor === Boolean || tor === String) return target.valueOf() === source.valueOf();
        if (tor === Number || tor === BigInt) {
          const targetValue = target.valueOf(),
            sourceValue = source.valueOf();
          return (
            targetValue === sourceValue ||
            (targetValue !== targetValue && sourceValue !== sourceValue)
          );
        }
        if (tor === Error)
          return (
            target.name === source.name &&
            target.message === source.message &&
            target.cause === source.cause
          );
      }
      if (tag === undefined) {
        var tag = toString.call(target);
        if (tag !== toString.call(source)) return false;
        tor =
          tag === "[object Object]"
            ? Object
            : tag === "[object Array]"
              ? Array
              : tag === "[object DataView]"
                ? DataView
                : tag === "[object ArrayBuffer]"
                  ? ArrayBuffer
                  : tag === "[object SharedArrayBuffer]"
                    ? SharedArrayBuffer
                    : tag === "[object Map]"
                      ? Map
                      : tag === "[object Set]"
                        ? Set
                        : tag === "[object Date]"
                          ? Date
                          : tag === "[object RegExp]"
                            ? RegExp
                            : tag === "[object Boolean]"
                              ? Boolean
                              : tag === "[object String]"
                                ? String
                                : tag === "[object Number]"
                                  ? Number
                                  : tag === "[object BigInt]"
                                    ? BigInt
                                    : tag === "[object Error]"
                                      ? Error
                                      : isTypedArray(target)
                                        ? Uint8Array
                                        : undefined;
        if (tor !== undefined) continue;
      }
      if (fallback) {
        if (typeof target.valueOf === "function" && typeof source.valueOf === "function") {
          const targetValue = target.valueOf(),
            sourceValue = source.valueOf();
          if (targetValue !== target && sourceValue !== source)
            return (
              targetValue === sourceValue ||
              objectEqualsCore(
                targetValue,
                sourceValue,
                circular,
                crossrealm,
                react,
                symbols,
                fallback,
                cache,
              )
            );
        }
        if (typeof target.toString === "function" && typeof source.toString === "function") {
          const targetString = target.toString(),
            sourceString = source.toString();
          if (targetString !== target && sourceString !== source)
            return targetString === sourceString;
        }
      }
      throw TypeError(`Unsupported object type: ${tag}`);
    }
  }
  if (react && typeof target === "function" && typeof source === "function") return true;
  return target === source || (target !== target && source !== source);
}

export function objectEquals(target, source, options) {
  if (target === source) return true;
  const circular = options?.circular === true;
  const crossrealm = options?.crossrealm === true;
  const react = options?.react === true;
  const symbols = options?.symbols === true;
  const fallback = options?.fallback === true;
  const cache = circular ? (options.cache != null ? options.cache : new Map()) : undefined;
  return objectEqualsCore(target, source, circular, crossrealm, react, symbols, fallback, cache);
}
