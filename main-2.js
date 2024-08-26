const _letters = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M'];

function shuffle(list) {
    const res = [];
    const copyOfList = [ ...list ];
    while(copyOfList.length > 0) {
        res.push(...copyOfList.splice(Math.floor(Math.random() * copyOfList.length), 1));
    }
    return res;
}

function rollDice(faces) {
    const _faces = Array(faces).fill(0).map((_, i) => i + 1);
    return _faces[Math.floor(_faces.length * Math.random())];
}

function pickUnique(sample, list) {
    if (sample > list.length) {
        return;
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

function getSum(pair, lnm) {
    let res;
    let safe = 20;
    while(!res && safe--) {
        switch (rollDice(3)) {
            case 1: { // A + B = [N]
                const n = lnm[pair[0]] + lnm[pair[1]];
                res = `${pair[0]} + ${pair[1]} = ${n}`; 
                break;
            }
            case 2: { // A + [N] = B
                const n = lnm[pair[1]] - lnm[pair[0]];
                const sign = Math.sign(n);
                if (sign === -1) {
                    break;
                }
                res = `${pair[0]} + ${n} = ${pair[1]}`; 
                break;
            }
            case 3: { // A + B = C
                const c = lnm[pair[0]] + lnm[pair[1]];
                for (const k in lnm) {
                    if (k !== pair[0] && k !== pair[1] && lnm[k] === c) {
                        res = `${pair[0]} + ${pair[1]} = ${k}`;
                        break;
                    }
                }
                break;
            }
        }
    }
    return res;
}

function getDiff(pair, lnm) {
    let res;
    let safe = 20;
    while(!res && safe--) {
        switch (rollDice(3)) {
            case 1: { // A - B = [N]
                const n = lnm[pair[0]] - lnm[pair[1]];
                res = `${pair[0]} - ${pair[1]} = ${n}`; 
                break;
            }
            case 2: { // A - [N] = B
                const n = lnm[pair[0]] - lnm[pair[1]];
                const sign = Math.sign(n);
                if (sign === -1) {
                    break;
                }
                res = `${pair[0]} - ${n} = ${pair[1]}`; 
                break;
            }
            case 3: { // A - B = C
                const c = lnm[pair[0]] - lnm[pair[1]];
                for (const k in lnm) {
                    if (k !== pair[0] && k !== pair[1] && lnm[k] === c) {
                        res = `${pair[0]} - ${pair[1]} = ${k}`;
                        break;
                    }
                }
                break;
            }
        }
    }
    return res;
}

function getCmp(pair, lnm) {
    let res;
    let safe = 20;
    while(!res && safe--) {
        switch (rollDice(3)) {
            case 1: { // A < B | A > B
                const sign = Math.sign(lnm[pair[0]] - lnm[pair[1]]);
                switch (sign) {
                    case -1:
                        res = `${pair[0]} < ${pair[1]}`;
                        break;
                    case 1:
                        res = `${pair[0]} > ${pair[1]}`;
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
                        res = `${pair[0]} + ${Math.abs(diff + 1)} < ${pair[1]}`;
                        break;
                    }
                    case 1: {
                        res = `${pair[0]} - ${diff - 1} > ${pair[1]}`;
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
                        res = `${pair[0]} + ${pair[1]} < ${_c}`;
                        break;
                    } else if (isAMinusBMoreThanC) {
                        res = `${pair[0]} - ${pair[1]} > ${_c}`;
                        break;
                    }
                }
                break;
            }
        }
    }
    return res;
}

function getMul(pair, lnm) {
    let res;
    let safe = 20;
    while(!res && safe--) {
        switch (rollDice(3)) {
            case 1: { // A * B = [N]
                const n = lnm[pair[0]] * lnm[pair[1]];
                if ((n+``).length > 2) {
                    return false;
                }
                res = `${pair[0]} × ${pair[1]} = ${n}`;
                break;
            }
            case 2: { // A * [N] = B
                const n = lnm[pair[0]] / lnm[pair[1]];
                if (n % 1 !== 0) {
                    break;
                }
                res = `${pair[0]} × ${n} = ${pair[1]}`;
                break;
            }
            case 3: { // A * B = C
                const c = lnm[pair[0]] * lnm[pair[1]];
                for (const k in lnm) {
                    if (c === lnm[k]) {
                        res = `${pair[0]} × ${pair[1]} = ${k}`;
                        break;
                    }
                }
                break;
            }
        }
    }
    return res;
}

function getDiv(pair, lnm) {
    let res;
    let safe = 20;
    while(!res && safe--) {
        switch (rollDice(3)) {
            case 1: { // A / B = [N]
                const n = lnm[pair[0]] / lnm[pair[1]];
                if (n % 1 !== 0) {
                    break;
                }
                res = `${pair[0]} ÷ ${pair[1]} = ${n}`;
                break;
            }
            case 2: { // [N] / A = B
                const n = lnm[pair[0]] * lnm[pair[1]];
                if ((n+``).length > 2) {
                    return false;
                }
                res = `${n} ÷ ${pair[0]} = ${pair[1]}`;
                break;
            }
            case 3: { // A / B = C
                const c = lnm[pair[0]] / lnm[pair[1]];
                for (const k in lnm) {
                    if (c === lnm[k]) {
                        res = `${pair[0]} ÷ ${pair[1]} = ${k}`;
                        break;
                    }
                }
                break;
            }
        }
    }
    return res;
}

function getGame(n) {
    // Choose values
    const letters = pickUnique(n, _letters);
    const numbers = pickUnique(n, Array(n).fill(0).map((_, i) => i + 1));
    const letterNumberMap = letters.reduce((a, c, i) => (a[c] = numbers[i], a), {});

    // Create chain of pairs
    const chainPairs = [];
    for (let i = 0; i < n; i++) {
        chainPairs.push([ letters[i], letters[(i + 1) % n] ]);
    }

    console.log(letterNumberMap, chainPairs);

    // Pick operations
    const operations = [];
    for(const pair of chainPairs) {
        let operation;
        while(!operation) {
            switch (rollDice(5)) {
                case 1: {
                    operation = getSum(pair, letterNumberMap);
                    break;
                }
                case 2: {
                    operation = getDiff(pair, letterNumberMap);
                    break;
                }
                case 3: {
                    operation = getCmp(pair, letterNumberMap);
                    break;
                }
                case 4: {
                    operation = getMul(pair, letterNumberMap);
                    break;
                }
                case 5: {
                    operation = getDiv(pair, letterNumberMap);
                    break;
                }
            }
        }
        operations.push(operation);
    }
    
    console.log("operations", shuffle(operations));
}

getGame(8);