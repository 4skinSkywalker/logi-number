export interface IGame {
    letterNumberMap: Record<string, number>;
    chainPairs: [string, string][];
    operations: string[];
}

interface IOperation {
    type: EnumOperationTypes;
    op: string;
}

enum EnumOperationTypes {
    SUM_DIFF = "Sum and difference",
    CMP = "Comparison",
    MUL = "Multiplication",
    DIV = "Division",
}

const _letters = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M'];

function shuffle<T>(list: T[]) {
    const res = [];
    const copyOfList = [ ...list ];
    while(copyOfList.length > 0) {
        res.push(...copyOfList.splice(Math.floor(Math.random() * copyOfList.length), 1));
    }
    return res;
}

function rollDice(faces: number) {
    const _faces = Array(faces).fill(0).map((_, i) => i + 1);
    return _faces[Math.floor(_faces.length * Math.random())];
}

function pickUnique<T>(sample: number, list: T[]) {
    if (sample > list.length) {
        return [];
    }

    const res = [];
    const copyOfList = [ ...list ];
    for (let i = 0; i < sample; i++) {
        const rndIdx = Math.floor(copyOfList.length * Math.random());
        const rnd = copyOfList[rndIdx];
        res.push(rnd);
        copyOfList.splice(rndIdx, 1);
    }

    return res;
}

function getSumDiff(pair: [ string, string ], lnm: Record<string, number>): IOperation | undefined {
    const type = EnumOperationTypes.SUM_DIFF;

    let res: IOperation | undefined;
    let safe = 20;
    while(!res && safe--) {
        switch (rollDice(4)) {
            case 1: { // A +|- B = [N]
                const op = ["+", "-"][Math.floor(Math.random() * 2)];
                const n = eval(`${lnm[pair[0]]} ${op} ${lnm[pair[1]]}`);
                res = { type, op: `${pair[0]} ${op} ${pair[1]} = ${n}`}; 
                break;
            }
            case 2: { // A +|- [N] = B
                const op = ["+", "-"][Math.floor(Math.random() * 2)];
                const n = eval(`${lnm[pair[0]]} - ${lnm[pair[1]]}`);
                switch (op) {
                    case "+": {
                        if (Math.sign(n) > 0) {
                            res = { type, op: `${pair[1]} + ${n} = ${pair[0]}` };
                            break;
                        } else {
                            res = { type, op: `${pair[0]} + ${Math.abs(n)} = ${pair[1]}` };
                            break;
                        }
                    }
                    case "-": {
                        if (Math.sign(n) > 0) {
                            res = { type, op: `${pair[0]} - ${n} = ${pair[1]}` };
                            break;
                        } else {
                            res = { type, op: `${pair[1]} - ${Math.abs(n)} = ${pair[0]}` };
                            break;
                        }
                    }
                }
                break;
            }
            case 3: { // A +|- B = C
                const op = ["+", "-"][Math.floor(Math.random() * 2)];
                const c = eval(`${lnm[pair[0]]} ${op} ${lnm[pair[1]]}`);
                for (const k in lnm) {
                    if (k === pair[0] && k === pair[1]) {
                        continue;
                    }
                    if (lnm[k] === c) {
                        res = { type, op: `${pair[0]} ${op} ${pair[1]} = ${k}` };
                        break;
                    }
                    if ((lnm[k] * -1) === c) {
                        res = { type,  op: `${pair[0]} ${op} ${pair[1]} = -${k}` };
                        break;
                    }
                }
                break;
            }
            case 4: { // A +|- B = C +|- D
                const leftHand = lnm[pair[0]] + lnm[pair[1]];
                for (const k in lnm) {
                    for (const m in lnm) {
                        if (k === m) {
                            continue;
                        }
                        const rightHand = lnm[k] + lnm[m];
                        if (k !== pair[0] && k !== pair[1] && leftHand === rightHand) {
                            res = { type, op: `${pair[0]} + ${pair[1]} = ${k} + ${m}` };
                            break;
                        }
                    }
                }
                break;
            }
        }
    }
    return res;
}

function getCmp(pair: [ string, string ], lnm: Record<string, number>): IOperation | undefined {
    const type = EnumOperationTypes.CMP;

    let res: IOperation | undefined;
    let safe = 20;
    while(!res && safe--) {
        switch (rollDice(3)) {
            case 1: { // A < B | A > B
                const sign = Math.sign(lnm[pair[0]] - lnm[pair[1]]);
                switch (sign) {
                    case -1:
                        res = { type, op: `${pair[0]} < ${pair[1]}` };
                        break;
                    case 1:
                        res = { type, op: `${pair[0]} > ${pair[1]}` };
                        break;
                }
                break;
            }
            case 2: { // A + [N] < B | A - [N] > B
                const diff = lnm[pair[0]] - lnm[pair[1]];
                if (diff === 1 || diff === -1) {
                    break;
                }

                const sign = Math.sign(diff);
                switch (sign) {
                    case -1: {
                        res = { type, op: `${pair[0]} + ${Math.abs(diff + 1)} < ${pair[1]}` };
                        break;
                    }
                    case 1: {
                        res = { type,  op: `${pair[0]} - ${diff - 1} > ${pair[1]}` };
                        break;
                    }
                }
                break;
            }
            case 3: { // A + B < C | A - B > C
                const lnmCopy = { ...lnm };
                delete lnmCopy[pair[0]];
                delete lnmCopy[pair[1]];
                while(!res && Object.keys(lnmCopy).length) {
                    const _c = pickUnique(1, Object.keys(lnmCopy))[0];
                    delete lnmCopy[_c];
                    const isAPlusBLessThanC = lnm[pair[0]] + lnm[pair[1]] < lnm[_c];
                    const isAMinusBMoreThanC = lnm[pair[0]] - lnm[pair[1]] > lnm[_c];
                    if (isAPlusBLessThanC) {
                        res = { type, op: `${pair[0]} + ${pair[1]} < ${_c}` };
                        break;
                    } else if (isAMinusBMoreThanC) {
                        res = { type, op: `${pair[0]} - ${pair[1]} > ${_c}` };
                        break;
                    }
                }
                break;
            }
        }
    }
    return res;
}

function getMul(pair: [ string, string ], lnm: Record<string, number>): IOperation | undefined {
    const type = EnumOperationTypes.MUL;

    const a = lnm[pair[0]];
    const b = lnm[pair[1]];
    // if (a === 1 || b === 1) { // Too easy
    //     return undefined;
    // }

    let res: IOperation | undefined;
    let safe = 20;
    while(!res && safe--) {
        switch (rollDice(4)) {
            case 1: { // A * B = [N]
                const n = lnm[pair[0]] * lnm[pair[1]];
                if ((n+``).length > 2) {
                    return undefined;
                }
                res = { type, op: `${pair[0]} × ${pair[1]} = ${n}` };
                break;
            }
            case 2: { // A * [N] = B
                const n = lnm[pair[0]] / lnm[pair[1]];
                if (n % 1 !== 0) {
                    break;
                }
                res = { type, op: `${pair[0]} × ${n} = ${pair[1]}` };
                break;
            }
            case 3: { // A * B = C
                const c = lnm[pair[0]] * lnm[pair[1]];
                for (const k in lnm) {
                    if (pair[0] !== k && pair[1] !== k && c === lnm[k]) {
                        res = { type, op: `${pair[0]} × ${pair[1]} = ${k}` };
                        break;
                    }
                }
                break;
            }
            case 4: { // A * B = C + [N]
                const c = lnm[pair[0]] * lnm[pair[1]];
                for (const k in lnm) {
                    if (pair[0] === k && pair[1] === k) {
                        continue;
                    }
                    for (let i = _letters.length - 1; i > 0; i--) {
                        if (c === (lnm[k] + i)) {
                            res = { type, op: `${pair[0]} × ${pair[1]} = ${k} + ${i}` };
                            break;
                        }
                    }
                }
                break;
            }
        }
    }
    return res;
}

function getDiv(pair: [ string, string ], lnm: Record<string, number>): IOperation | undefined {
    const type = EnumOperationTypes.DIV;

    const a = lnm[pair[0]];
    const b = lnm[pair[1]];
    // if (a === 1 || b === 1) { // Too easy
    //     return undefined;
    // }

    let res: IOperation | undefined;
    let safe = 20;
    while(!res && safe--) {
        switch (rollDice(4)) {
            case 1: { // A / B = [N]
                const n = lnm[pair[0]] / lnm[pair[1]];
                if (n % 1 !== 0) {
                    break;
                }
                res = { type, op: `${pair[0]} ÷ ${pair[1]} = ${n}` };
                break;
            }
            case 2: { // [N] / A = B
                const n = a * b;
                if ((n+``).length > 2) {
                    return undefined;
                }
                res = { type, op: `${n} ÷ ${pair[0]} = ${pair[1]}` };
                break;
            }
            case 3: { // A / B = C
                const c = lnm[pair[0]] / lnm[pair[1]];
                for (const k in lnm) {
                    if (c === lnm[k]) {
                        res = { type, op: `${pair[0]} ÷ ${pair[1]} = ${k}` };
                        break;
                    }
                }
                break;
            }
            case 4: { // A / B = C - [N]
                const c = lnm[pair[0]] / lnm[pair[1]];
                for (const k in lnm) {
                    if (pair[0] === k && pair[1] === k) {
                        continue;
                    }
                    for (let i = _letters.length - 1; i > 0; i--) {
                        if (c === (lnm[k] - i)) {
                            res = { type, op: `${pair[0]} ÷ ${pair[1]} = ${k} - ${i}` };
                            break;
                        }
                    }
                }
                break;
            }
        }
    }
    return res;
}

export function getGame(n: number): IGame {
    // Choose values
    const letters = pickUnique(n, _letters);
    const numbers = pickUnique(n, Array(n).fill(0).map((_, i) => i + 1));
    const letterNumberMap = letters.reduce((a, c, i) => (a[c] = numbers[i], a), {} as Record<string, number>);

    // Create chain of pairs
    const chainPairs = [];
    for (let i = 0; i < n; i++) {
        chainPairs.push([ letters[i], letters[(i + 1) % n] ] as [ string, string ]);
    }
    chainPairs.push(pickUnique(2, letters) as [ string, string ]);

    // Pick operations
    const operations: IOperation[] = [];
    for(const pair of chainPairs) {
        let operation;
        let safe = 1e2;
        while(!operation && safe--) {
            switch (rollDice(4)) {
                case 1: {
                    const sumDiff = getSumDiff(pair, letterNumberMap);
                    if (!sumDiff) {
                        break;
                    }
                    const symbols = new Set(sumDiff.op.match(/([A-Z])/g)) || [];
                    const getSymbolIntersection = (op: string) => {
                        const filtered = (op.match(/([A-Z])/g) || ["-"]).filter(symbol => symbols.has(symbol));
                        return [...new Set(filtered)];
                    }
                    if (operations.filter(({ type }) => type === EnumOperationTypes.SUM_DIFF).some(({ op }) => getSymbolIntersection(op).length === symbols.size)) {
                        break;
                    }
                    operation = sumDiff;
                    break;
                }
                case 2: {
                    const hasCmp = (op: string) => {
                        return op.indexOf("<") || op.indexOf(">");
                    }
                    if (operations.filter(({ op }) => hasCmp(op)).length >= Math.floor(n/2)-1) {
                        break;
                    }
                    const cmp = getCmp(pair, letterNumberMap);
                    if (!cmp) {
                        break;
                    }
                    const variant1 = cmp.op.replace(/(\w+) < (\w+)/i, "$2 > $1");
                    const variant2 = cmp.op.replace(/(\w+) > (\w+)/i, "$2 < $1");
                    if (operations.some(({ op }) => [cmp.op, variant1, variant2].includes(op))) {
                        break;
                    }
                    operation = cmp;
                    break;
                }
                case 3: {
                    const mul = getMul(pair, letterNumberMap);
                    if (!mul) {
                        break;
                    }
                    const variant1 = mul.op.replace(/(\w+) × (\w+) = (\w+)/i, "$2 × $1 = $3");
                    const variant2 = mul.op.replace(/(\w+) × (\w+) = (\w+)/i, "$3 ÷ $1 = $2");
                    const variant3 = mul.op.replace(/(\w+) × (\w+) = (\w+)/i, "$3 ÷ $2 = $1");
                    if (operations.some(({ op }) => [mul.op, variant1, variant2, variant3].includes(op))) {
                        break;
                    }
                    operation = mul;
                    break;
                }
                case 4: {
                    const div = getDiv(pair, letterNumberMap);
                    if (!div) {
                        break;
                    }
                    const variant1 = div.op.replace(/(\w+) ÷ (\w+) = (\w+)/i, "$1 ÷ $3 = $2");
                    const variant2 = div.op.replace(/(\w+) ÷ (\w+) = (\w+)/i, "$2 × $3 = $1");
                    const variant3 = div.op.replace(/(\w+) ÷ (\w+) = (\w+)/i, "$3 × $2 = $1");
                    if (operations.some(({ op }) => [div.op, variant1, variant2, variant3].includes(op))) {
                        break;
                    }
                    operation = div;
                    break;
                }
            }
        }
        if (operation) {
            operations.push(operation);
        }
    }
    
    return {
        letterNumberMap,
        chainPairs,
        operations: shuffle(operations.map(x => x.op))
    }
}
////////////////////////////////////////////////////////////////////////////////
function nextPermutation(elements: any[], elementValue: any) {
    // Find longest non-increasing suffix
    let i = elements.length - 1;
    while (elementValue[elements[i]] <= elementValue[elements[i - 1]]) i--;

    if (i === 0) return false;

    const pivot = i - 1;

    // Find smallest rightmost number that's bigger than pivot
    let j = elements.length - 1;
    while (elementValue[elements[j]] < elementValue[elements[pivot]]) j--;

    // Swap
    [elements[pivot], elements[j]] = [elements[j], elements[pivot]];

    // Reverse suffix
    let k = i;
    let m = elements.length - 1;
    while (k < m) {
        [elements[k], elements[m]] = [elements[m], elements[k]];
        k++;
        m--;
    }

    return elements;
}

function generateAllPermutations(elements: any[], elementValue: any) {
    const permutations = [[...elements]];
    let permutation = nextPermutation(elements, elementValue);
    while (permutation) {
        permutations.push([...permutation]);
        permutation = nextPermutation(elements, elementValue);
    }
    return permutations;
}

function checkLogiNumber(game: { operations: any[], letterNumberMap: {[key: string]: number} }) {
    // Unpack logiNumber
    const clues = game.operations;
    const letterNumber = game.letterNumberMap;

    const letters = Object.keys(letterNumber);
    const side = letters.length;

    // Get permutations of letterNumber
    const numbers = Array(side)
        .fill(0)
        .map((_, i) => ++i);
    const permutations = generateAllPermutations(
        numbers,
        numbers.reduce((a, b) => ((a[b] = b), a), {} as any)
    );
    const letterNumberList = permutations.map((p) =>
        p.reduce((a, b, i) => ((a[letters[i]] = b), a), {})
    );

    // Adjust expression for evaluation
    const expressions = clues.map((c) =>
        c.replace("×", "*").replace("÷", "/").replace("=", "===")
    );

    // Get validity for each permutation
    const validityList = letterNumberList.map((letterNumber) =>
        expressions
            .map((expression) => {
                Object.entries(letterNumber).forEach(
                    ([letter, number]) =>
                        (expression = expression.replaceAll(letter, number as any))
                );
                return expression;
            })
            .every((expression) => eval(expression))
    );

    // Return valid if no more than 1 solution was found
    return validityList.filter((validity) => validity).length < 2;
}

async function testValidity() {
    let k = 0;
    let m = 0;
    let i = 8;
    while (i--) {
        if (i === 2) break;
        console.log("GENERATING SOLUTIONS FOR I =", i);
        let j = 200;
        while (j--) {
            k++;
            const g = getGame(i);
            const valid = checkLogiNumber(g);
            if (!valid) {
                m++;
                console.log("NON-UNIQUE SOLUTION", g);
                console.log("GENERATED", k, "GAMES");
                console.log("WITH", m, "NON-UNIQUE GAMES");
            }
        }
        await new Promise(r => setTimeout(r, 100));
    }
    console.log("COMPLETED!");
    console.log("GENERATED", k, "GAMES");
    console.log("WITH", m, "NON-UNIQUE GAMES");
};

// testValidity();