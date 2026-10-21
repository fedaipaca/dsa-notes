/**
 * 
 * We need to generate a pseudorandom password of a given length that satisfies four distinct constraints:
 * - Contains at least one uppercase letter (A-Z).
 * - Contains at least one lowercase letter (a-z).
 * - Contains at least one number (0-9).
 * - Contains at least one special character (e.g., !@#$%^&*...).
 * 
 * Key Constraint: The minimum possible length for such a password is $4$. If $N < 4$, it is logically impossible to include all four mandatory character types.
 */



function generatePassword(length: number): string {
    if (length < 4) {
        throw new Error("Password length must be at least 4 to satisfy all criteria.");
    }

    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const specials = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    const allChars = uppercase + lowercase + numbers + specials;

    const getRandomChar = (str: string): string => str[Math.floor(Math.random() * str.length)];

    // 1. Guarantee at least one of each required type
    const chars: string[] = [
        getRandomChar(uppercase),
        getRandomChar(lowercase),
        getRandomChar(numbers),
        getRandomChar(specials),
    ];

    // 2. Fill the remaining length
    for (let i = 4; i < length; i++) {
        chars.push(getRandomChar(allChars));
    }

    // 3. Fisher-Yates shuffle to randomize positions
    for (let i = chars.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [chars[i], chars[j]] = [chars[j]!, chars[i]!];
    }

    return chars.join("");
}

// all chracters are unique
function generateUniquePassword(length: number): string {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const lowercase = "abcdefghijklmnopqrstuvwxyz".split("");
  const numbers = "0123456789".split("");
  const specials = "!@#$%^&*()_+-=[]{}|;:,.<>?".split("");

  const totalPoolSize = uppercase.length + lowercase.length + numbers.length + specials.length;

  if (length < 4) {
    throw new Error("Password length must be at least 4 to satisfy all criteria.");
  }
  if (length > totalPoolSize) {
    throw new Error(`Password length cannot exceed ${totalPoolSize} when all characters must be unique.`);
  }

  // Helper to pick a random index, remove it from the array, and return the item
  const drawRandom = (arr: string[]): string => {
    const index = Math.floor(Math.random() * arr.length);
    return arr.splice(index, 1)[0]!;
  };

  // 1. Guarantee 1 unique character from each required category
  const chars: string[] = [
    drawRandom(uppercase),
    drawRandom(lowercase),
    drawRandom(numbers),
    drawRandom(specials),
  ];

  // 2. Combine all remaining unused characters into a single pool
  const remainingPool = [...uppercase, ...lowercase, ...numbers, ...specials];

  // 3. Shuffle the remaining pool using Fisher-Yates
  for (let i = remainingPool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [remainingPool[i], remainingPool[j]] = [remainingPool[j]!, remainingPool[i]!];
  }

  // 4. Take the needed number of characters from the shuffled remaining pool
  chars.push(...remainingPool.slice(0, length - 4));

  // 5. Final Fisher-Yates shuffle to mix mandatory and random characters
  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [chars[i], chars[j]] = [chars[j]!, chars[i]!];
  }

  return chars.join("");
}