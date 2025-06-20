/// question : https://stackoverflow.com/questions/57476487/how-to-check-if-a-string-contains-only-white-space-or-is-empty-in-typescript/57476978#57476978
/// answer : https://stackoverflow.com/a/57476978/18038473
/// answered by Christopher Peisert. profile: https://stackoverflow.com/users/1164465/christopher-peisert
const isEmpty = (arg) => {
  return arg === null || arg?.match(/^ *$/) !== null;
};

export { isEmpty };
