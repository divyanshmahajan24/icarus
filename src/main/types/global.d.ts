declare module 'electron-better-ipc' {
  const x: {
    callMain: <T, R>(str: string, arg: T) => Promise<R>;
    answerMain: (str: string, fn: <T, R>(arg: T) => R | void) => void;
    callRenderer: <T, R>(str: string, arg: T) => Promise<R>;
    answerRenderer: (str: string, fn: <T, R>(arg: T) => R | void) => void;
  };
  export = x;
}
