// should return true for 0-9 or a-Z
// ts
function isAlphaNum(char: string) {
    const isLower = char >= 'a' && char <= 'z';
    const isUpper = char >= 'A' && char <= 'Z';
    const isNum = char >= '0' && char <= '9';
    return isLower || isUpper || isNum;
}

// console.log(isAlphaNum('a'))
// console.log(isAlphaNum('b'))
// console.log(isAlphaNum('C'))
// console.log(isAlphaNum('0'))
// console.log(isAlphaNum('7'))
// console.log(isAlphaNum('9'))
// console.log(isAlphaNum('.'))
// console.log(isAlphaNum(','))
// console.log(isAlphaNum(' '))


function stringSplit(str: string, char: string): string[] {
    let word: string[] = [];
    let words: string[] = [];

    for (const c of str) {
        if (c !== char) {
            word.push(c);
        } else {
            words.push(word.join(""));
            word = [];
        }
    }

    words.push(word.join(""));

    return words;

}

console.log(stringSplit("split by space", " "));