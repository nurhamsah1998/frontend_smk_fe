/// https://stackoverflow.com/a/57476978/18038473
const isEmpty = (arg) => {
  return arg === null || arg?.match(/^ *$/) !== null;
};

export { isEmpty };
