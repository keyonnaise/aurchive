function pipe<I>(initial: I): I;
function pipe<I, O1>(initial: I, fn1: (value: I) => O1): O1;
function pipe<I, O1, O2>(initial: I, fn1: (value: I) => O1, fn2: (value: O1) => O2): O2;
function pipe<I, O1, O2, O3>(initial: I, fn1: (value: I) => O1, fn2: (value: O1) => O2, fn3: (value: O2) => O3): O3;
function pipe(initial: any, ...funcs: ((value: any) => any)[]): any {
  return funcs.reduce((result, func) => func(result), initial);
}

export default pipe;
