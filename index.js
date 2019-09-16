const isArray = Array.isArray;
const isObject = o => !!o && (!Array.isArray(o) && typeof o === 'object');
const isFunction = false;

const flatten = (obj, opts = {}) => {
    // const excludeSet = new Set(exclude);
    const { delimiter = '.', includeArrays = true } = opts;
    const _flatten = (val, path, acc) => {
        let returnVal;
        if (!includeArrays) {
            acc = isObject(acc) ? acc : {};
            path = path ? path : '';
            if(isObject(val)) {
                Object.entries(val)
                    .forEach(([k,v]) => _flatten(v, `${path}${delimiter}${k}`, acc));
            }
            else if (isArray(val)) {
                val.forEach((v,i) => _flatten(v, `${path}[${i}]`, acc));
            }
            else {
                acc[path] = val;
            }

            returnVal = acc;
        }
        else if (isArray(val)) {
            acc = isArray(acc) ? acc : [];
            for (const v of val) {
                isArray(v) ? _flatten(v, null, acc) : acc.push(_flatten(v));
            }
            returnVal = acc;
        }
        else if (isObject(val)) {
            acc = isObject(acc) ? acc : {};
            const keys = Object.keys(val); // .filter(k => !excludeSet.has(k));
            for (const k of keys) {
                const p = path ? `${path}${delimiter}${k}` : k;
                const v = val[k];
                isObject(v) ? _flatten(v, p, acc) : acc[p] = _flatten(v);
            }
            returnVal = acc;
        }
        else {
            returnVal = val;
        }

        return returnVal;
    }

    return _flatten(obj);
};

module.exports.flato = flatten;

// console.debug(JSON.stringify(flatten([
//     { a: { b: [{ c: { d: "df" } }, 2] } },
//     {r: 3}
// ], {includeArrays: true}
// ), null, 2));

// return;
// console.debug(JSON.stringify(flatten("hello"), null, 2));
// console.debug(JSON.stringify(flatten({ a: { b: { c: { d: "df" } } } }), null, 2));
// console.debug(JSON.stringify(flatten(
//     [
//         [[{ a: { b: { c: { d: "df" } } } }]],
//         { a: { b: { c: { d: [[], [1], [{ a: { b: { c: { d: "df" } } } }]] } } } }
//     ]), null, 2));
// console.debug(JSON.stringify(flatten(
//     [
//         [[1], [], [[2], [[3]]]],
//         { a: { b: { c: { d: [[], [1], [{ a: { b: { c: { d: "df" } } } }]] } } } }
//     ], { includeArrays: true }), null, 2));

// console.debug(JSON.stringify(flatten(
//     [
//         [[1], [], [[2], [[3]]]],
//         { a: { b: { c: { d: [[], [1], [{ a: { b: { c: { d: "df" } } } }]] } } } }
//     ]), null, 2));

// console.debug(JSON.stringify(
//     flatten(
//         {
//             key1: {
//                 keyA: 'valueI'
//             },
//             key2: {
//                 keyB: 'valueII'
//             },
//             key3: { a: { b: { c: 2 } } },
//             arr: [[2, { a: { b: { c: 2 } } }], [1, [[[2]]]]]
//         },
//         [],
//         '.'
//     ),
//     null, 2
// ));