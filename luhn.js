//------------------------------------------------------------------------------
// Test assertion functions

const assertEqual = function (actual, expected) {
  const [color, emoji, outcome, operator] =
    actual === expected
      ? ['\x1b[2m\x1b[32m', '  ', 'Passed', '===']
      : ['\x1b[0m\x1b[31m', '\u274c', 'Failed', '!=='];

  console.log(
    color + emoji,
    `Assertion ${outcome}: ${actual} ${operator} ${expected}`
  );
};

const eqArrays = (arr1, arr2) => {
  // Check same number of elements
  if (arr1.length !== arr2.length) return false;

  // Check same elements
  for (const index in arr1) {
    const elem = arr1[index];
    const equal = Array.isArray(elem)
      ? eqArrays
      : typeof elem === 'object'
      ? (a, b) => a === b // @todo eqObjects
      : (a, b) => a === b; // also handles undefined
    if (!equal(elem, arr2[index])) return false;
  }
  return true;
};

const assertArraysEqual = (arr1, arr2) => {
  const [color, emoji, outcome, operator] = eqArrays(arr1, arr2)
    ? ['\x1b[2m\x1b[32m', '  ', 'Passed', '===']
    : ['\x1b[0m\x1b[31m', '\u274c', 'Failed', '!=='];

  console.log(
    color + emoji + `Assertion ${outcome}:`,
    `[${arr1.join(', ')}] ${operator} [${arr2.join(', ')}]`
  );
};

//------------------------------------------------------------------------------
// Helper functions

const sum = (a, b) => a + b;

// Number to array of digits
const getDigits = (number) => {
  const digits = [];
  while (number) {
    const digit = number % 10;
    number = (number - digit) / 10;
    digits.push(digit);
  }
  return digits;
};

assertArraysEqual(getDigits(1234), [4, 3, 2, 1]);

// Recursively sum digits until less than 10
const sumDigits = (number) => {
  if (number < 10) return number;
  return sumDigits(getDigits(number).reduce(sum));
};

assertEqual(sumDigits(0), 0);
assertEqual(sumDigits(7), 7);
assertEqual(sumDigits(11), 2);
assertEqual(sumDigits(9993), 3);

//------------------------------------------------------------------------------
// Actual function

const luhn = (number) => {
  const check = getDigits(number)
    .map((x, i) => (i & 1 ? x << 1 : x))
    .map(sumDigits)
    .reduce(sum);
  return !(check % 10);
};

assertEqual(luhn(79927398713), true);
assertEqual(luhn(72927398713), false);
assertEqual(luhn(79920398713), false);
assertEqual(luhn(79927388713), false);
assertEqual(luhn(69927398713), false);
assertEqual(luhn(76927398713), false);
assertEqual(luhn(79927398703), false);
