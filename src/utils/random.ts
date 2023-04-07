export const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const generateRandomString = (
  length: number,
  possibleChars: string
): string => {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += possibleChars.charAt(
      Math.floor(Math.random() * possibleChars.length)
    );
  }
  return result;
};

export const randomChoice = <T>(choices: T[]): T => {
  const index = Math.floor(Math.random() * choices.length);
  return choices[index];
};
