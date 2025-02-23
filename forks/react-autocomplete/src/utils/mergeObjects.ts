// @ts-nocheck
/* eslint-disable */

const mergeObjects = <T1, T2>(obj1: T1, obj2: T2): T1 & T2 => {
  const merged = { ...obj1 };

  Object.entries(obj2).forEach(([key, prop2]) => {
    if (typeof prop2 === 'function') {
      const prop1 = obj1[key];
      merged[key] = prop1
        ? (...args) => {
            const result1 = prop1(...args);
            const result2 = prop2(...args);
            if (typeof result1 === 'object') {
              return mergeObjects(result1, result2);
            }
          }
        : prop2;
    } else {
      merged[key] = prop2;
    }
  });

  return merged;
};

export { mergeObjects };
