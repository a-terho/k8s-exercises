const info = (...args: string[]) => console.log(...args);

const debug = (...args: string[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(...args);
  }
};

const logger = { info, debug };
export default logger;
