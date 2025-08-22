
let currentInput = '0';
let previousInput = '';
let operation = null;
let resetInput = false;
let lastButtonWasOperator = false;

const resultElement = document.getElementById('result');
const expressionElement = document.getElementById('expression');
const operatorButtons = document.querySelectorAll('.operator');
const displayElement = document.querySelector('.display');


function updateDisplay() {

    if (previousInput || operation) {
        expressionElement.textContent = `${previousInput} ${operation ? getOperatorSymbol(operation) : ''} ${!resetInput ? currentInput : ''}`;
    } else {
        expressionElement.textContent = currentInput;
    }

    if (!displayElement.classList.contains('final')) {
        if ((operation && previousInput) && !lastButtonWasOperator) {
            const preview = compute(previousInput, currentInput, operation);
            resultElement.textContent = preview !== null ? formatResult(preview) : '';
        } else {
            resultElement.textContent = '';
        }
    }

}


function compute(a, b, op) {
    const num1 = parseFloat(a);
    const num2 = parseFloat(b);
    if (isNaN(num1) || isNaN(num2)) return null;

    switch (op) {
        case '+': return num1 + num2;
        case '-': return num1 - num2;
        case '*': return num1 * num2;
        case '/': return num2 === 0 ? null : num1 / num2;
        default: return null;
    }
}

function getOperatorSymbol(op) {
    switch (op) {
        case '+': return '+';
        case '-': return '−';
        case '*': return '×';
        case '/': return '÷';
        default: return op;
    }
}
function getOperatorFromSymbol(symbol) {
    switch (symbol) {
        case '+': return '+';
        case '−': return '-';
        case '×': return '*';
        case '÷': return '/';
        default: return symbol;
    }
}

function appendNumber(number) {
    if (resetInput) {
        currentInput = number;
        resetInput = false;
    } else {
        if (number === '.' && currentInput.includes('.')) return;
        if (currentInput === '0' && number !== '.') {
            currentInput = number;
        } else {
            currentInput += number;
        }
    }
    lastButtonWasOperator = false;
    displayElement.classList.remove('final');
    updateDisplay();
}

function appendOperator(op) {
    if (lastButtonWasOperator) {
        operation = op;
    } else {
        if (operation !== null) {
            calculate();
        }
        previousInput = currentInput;
        operation = op;
        resetInput = true;
    }
    lastButtonWasOperator = true;
    displayElement.classList.remove('final');
    updateDisplay();
}

function calculate() {
    if (!operation || previousInput === '') return;

    const originalExpression = `${previousInput} ${getOperatorSymbol(operation)} ${currentInput}`;
    const result = compute(previousInput, currentInput, operation);

    if (result !== null) {
        expressionElement.textContent = originalExpression;
        currentInput = formatResult(result);
        previousInput = '';
        operation = null;
        resetInput = true;
        lastButtonWasOperator = false;

        displayElement.classList.add('final');
        resultElement.textContent = currentInput;
    }
}

function formatResult(num) {
    return parseFloat(num.toFixed(8)).toString();
}

function clearAll() {
    currentInput = '0';
    previousInput = '';
    operation = null;
    resetInput = false;
    lastButtonWasOperator = false;
    displayElement.classList.remove('final');
    expressionElement.textContent = '0';
    resultElement.textContent = '';
}

function toggleSign() {
    if (currentInput === '0') return;
    currentInput = (parseFloat(currentInput) * -1).toString();
    updateDisplay();
}

function appendPercentage() {
    currentInput = (parseFloat(currentInput) / 100).toString();
    updateDisplay();
}

document.addEventListener('keydown', function (event) {
    if (event.key >= '0' && event.key <= '9') {
        appendNumber(event.key);
    } else if (event.key === '.') {
        appendNumber('.');
    } else if (event.key === '+' || event.key === '-' || event.key === '*' || event.key === '/') {
        appendOperator(event.key);
    } else if (event.key === 'Enter' || event.key === '=') {
        calculate();
    } else if (event.key === 'Escape') {
        clearAll();
    } else if (event.key === '%') {
        appendPercentage();
    } else if (event.key === 'Backspace') {
        if (currentInput.length > 1) {
            currentInput = currentInput.slice(0, -1);
        } else {
            currentInput = '0';
        }
        updateDisplay();
    }
});

updateDisplay();