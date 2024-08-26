const cellSize = 2;
const numbers = document.querySelector(".numbers");
const letters = document.querySelector(".letters");
const grid = document.querySelector(".grid");
const clueList = document.querySelector(".clues");
const alertText = document.querySelector(".alert");

const forms = [
    "A [O] B = [N]",
    "A [O] [N] = B",
];

let clues;
let letterNumber;
let size = 5;
let min = 3;
let max = 9;
const OPERATORS = "+×-÷";
const OPERATORS2 = OPERATORS + "<>";
const LETTERS = "QWERTYUIOPASDFGHJKLZCVBNM";

function getRandom(array) {
    return Math.floor(Math.random() * array.length);
}

function pickUnique(charset, quantity) {
    const copy = [...charset];
    const r = [];
    while (quantity--) {
        const rnd = getRandom(copy);
        r.push(copy.splice(rnd, 1)[0]);
    }
    return r;
}

function coinFlip() {
    return Math.random() > 0.5;
}

function getClue(letterNumber) {
    // Reverse map for lookup by number
    const numberLetter = Object.entries(letterNumber).reduce(
        (a, b) => ((a[b[1]] = b[0]), a),
        {}
    );

    const [a, b] = pickUnique(Object.keys(letterNumber), 2);
    const [v1, v2] = [letterNumber[a], letterNumber[b]];

    // Relational way
    if (coinFlip()) {
        const operator = pickUnique(OPERATORS, 1)[0];

        if (operator === "+") {
            const c = numberLetter[v1 + v2];
            if (!c || [a, b].includes(c)) return getClue(letterNumber);
            else return `${a} + ${b} = ${c}`;
        }

        if (operator === "-") {
            const c = numberLetter[v1 - v2];
            if (!c || [a, b].includes(c)) return getClue(letterNumber);
            else return `${a} - ${b} = ${c}`;
        }

        if (operator === "×") {
            const c = numberLetter[v1 * v2];
            if (!c || [a, b].includes(c)) return getClue(letterNumber);
            else return `${a} × ${b} = ${c}`;
        }

        if (operator === "÷") {
            const c = numberLetter[v1 / v2];
            if (!c || [a, b].includes(c)) return getClue(letterNumber);
            else return `${a} ÷ ${b} = ${c}`;
        }
    }

    const operator = pickUnique(OPERATORS2, 1)[0];

    if (operator === "<")
        if (v1 < v2) return `${a} < ${b}`;
        else return `${b} < ${a}`;

    if (operator === ">")
        if (v1 > v2) return `${a} > ${b}`;
        else return `${b} > ${a}`;

    if (operator === "+") return `${a} + ${b} = ${v1 + v2}`;

    if (operator === "-") return `${a} - ${b} = ${v1 - v2}`;

    if (operator === "×") return `${a} × ${b} = ${v1 * v2}`;

    if (operator === "÷")
        if (a === 1 || b === 1 || (v1 / v2) % 1 !== 0) return getClue(letterNumber);
        else return `${a} ÷ ${b} = ${v1 / v2}`;
}

function nextPermutation(elements, elementValue) {
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

function generateAllPermutations(elements, elementValue) {
    const permutations = [[...elements]];
    let permutation = nextPermutation(elements, elementValue);
    while (permutation) {
        permutations.push([...permutation]);
        permutation = nextPermutation(elements, elementValue);
    }
    return permutations;
}

function checkLogiNumber(logiNumber) {
    // Unpack logiNumber
    const { clues, letterNumber } = logiNumber;

    const letters = Object.keys(letterNumber);
    const side = letters.length;

    // Get permutations of letterNumber
    const numbers = Array(side)
        .fill(0)
        .map((_, i) => ++i);
    const permutations = generateAllPermutations(
        numbers,
        numbers.reduce((a, b) => ((a[b] = b), a), {})
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
                        (expression = expression.replaceAll(letter, number))
                );
                return expression;
            })
            .every((expression) => eval(expression))
    );

    // Return valid if no more than 1 solution was found
    return validityList.filter((validity) => validity).length < 2;
}

function getLogiNumber(side) {
    const numbers = pickUnique(
        Array(side)
            .fill(0)
            .map((_, i) => ++i),
        side
    );
    const letters = pickUnique(LETTERS, side);
    const letterNumber = letters.reduce(
        (a, b, i) => ((a[b] = numbers[i]), a),
        {}
    );

    const clues = [];
    for (let i = 0; i < side - 1; i++) {
        clues.push(getClue(letterNumber));
    }

    if (!checkLogiNumber({ clues, letterNumber })) return getLogiNumber(side);

    return { clues, letterNumber };
}

function createNumbers() {
    for (let i = -1; i < size; i++) {
        const number = document.createElement("DIV");
        if (i > -1) number.textContent = i + 1;
        number.style.width = cellSize + "rem";
        number.style.height = cellSize + "rem";
        number.classList.add("number");
        numbers.appendChild(number);
    }
}

function createLetters() {
    for (const _letter of Object.keys(letterNumber)) {
        const letter = document.createElement("DIV");
        letter.textContent = _letter;
        letter.style.width = cellSize + "rem";
        letter.style.height = cellSize + "rem";
        letter.classList.add("letter");
        letters.appendChild(letter);
    }
}

function containsSolutionMark(cell, list) {
    return list.some((_cell) => {
        if (cell === _cell) return false;
        return _cell.classList.contains("mark-solution");
    });
}

function addFunctionToCell(cell, colIndex) {
    cell.addEventListener("click", (evt) => {
        if (evt.target === cell) {
            const sol = cell.classList.contains("mark-solution");
            const exc = cell.classList.contains("mark-exclusion");
            const rowHasSol = containsSolutionMark(cell, [
                ...cell.parentNode.children,
            ]);
            const colHasSol = containsSolutionMark(
                cell,
                [...cell.parentNode.parentNode.children].map(
                    (row) => row.children[colIndex]
                )
            );
            if (exc) {
                cell.classList.remove("mark-exclusion");
            } else if (!sol && !rowHasSol && !colHasSol) {
                cell.classList.add("mark-solution");
            } else if (!exc) {
                cell.classList.remove("mark-solution");
                cell.classList.add("mark-exclusion");
            }
        }
    });
}

function createGrid() {
    const letters = [null, ...Object.keys(letterNumber)];
    for (let i = 1; i < size + 1; i++) {
        const row = document.createElement("DIV");
        row.style.width = cellSize * size + "rem";
        row.classList.add("row");
        for (let j = 1; j < size + 1; j++) {
            const cell = document.createElement("DIV");
            cell.style.width = cellSize + "rem";
            cell.style.height = cellSize + "rem";
            cell.classList.add("cell");
            if (letterNumber[letters[i]] === j) cell.classList.add("solution");
            addFunctionToCell(cell, j - 1);
            row.appendChild(cell);
        }
        grid.appendChild(row);
    }
}

function createClues() {
    for (const _clue of clues) {
        const clue = document.createElement("DIV");
        clue.innerText = _clue;
        clue.classList.add("clue");
        clueList.appendChild(clue);
    }
}

function updateSizeText() {
    [...document.querySelectorAll(".size")].forEach(
        (el) => (el.innerText = size)
    );
}

function decrease() {
    if (size > min) size--;
    updateSizeText();
    init();
}

function increase() {
    if (size < max) size++;
    updateSizeText();
    init();
}

function init() {
    numbers.innerHTML = "";
    letters.innerHTML = "";
    grid.innerHTML = "";
    clueList.innerHTML = "";
    const logiNumber = getLogiNumber(size);
    clues = logiNumber.clues;
    letterNumber = logiNumber.letterNumber;
    createNumbers();
    createLetters();
    createGrid();
    createClues();
}

function reset() {
    [...document.querySelectorAll(".cell")].forEach((cell) => {
        cell.classList.remove("mark-solution");
        cell.classList.remove("mark-exclusion");
    });
}

function alert(text, withTimeout = true) {
    alertText.innerText = text;
    if (withTimeout) setTimeout(() => alert("", false), 3000);
}

function check() {
    const isSolved = [...document.querySelectorAll(".solution")].every((cell) =>
        cell.classList.contains("mark-solution")
    );
    if (isSolved) alert("You solved it!");
    else alert("Not solved. Retry...");
}

init();
