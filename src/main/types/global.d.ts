declare module 'electron-better-ipc' {
  const x: {
    callMain: <T, R>(str: string, arg: T) => Promise<R>;
    answerMain: (str: string, fn: <T, R>(arg: T) => R | void) => void;
    callRenderer: <T, R>(str: string, arg: T) => Promise<R>;
    answerRenderer: <T>(str: string, fn: (arg: T) => any) => void;
  };
  export = x;
}

declare module 'react-dev-utils/launchEditor' {
  const x: any;
  export = x;
}
