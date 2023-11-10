
const digitButtons = document.querySelectorAll('.digit'); //  0 to 9
const currentDisplay = document.querySelector('.currentDisplay'); // input display
const previousDisplay = document.querySelector('.previousDisplay'); // previous operation display
const clearButton = document.querySelector('.clear');
const deleteButton = document.querySelector('.delete');
const binaryOperators = document.querySelectorAll('.binaryOperator'); // [ + , - , * , / , =]
const unaryOperators = document.querySelectorAll('.unaryOperator'); // [ +/- , sqrt]
const decimalButton = document.querySelector('.decimal');

const inputDigitLimit = 15;
const sqrtPrecisionFactor = 1e4;

// parameters
let clearcurrentDisplay = false;   // clearing current display when digit for new number is taken
let result = 0;                    // var for storing result of operations
let previousOperator = '+';       

// Input event Handling
setupEventListeners();

function setupEventListeners(){
    // click events
    decimalButton.addEventListener('click', addDecimal);

    clearButton.addEventListener('click', resetCalculator);

    deleteButton.addEventListener('click', deleteLastCharacter);

    for (let operator of binaryOperators) {
        operator.addEventListener('click', handleBinaryOperation);
    }

    for (let operator of unaryOperators) {
        operator.addEventListener('click', handleUnaryOperation);
    }

    for (let digit of digitButtons) {
        digit.addEventListener('click', inputDigit);
    }

    // keyboard events
    document.addEventListener('keydown', handleKeyPress);
}

// getting keyboard input
function handleKeyPress(e){
    const key = e.key;
    if(/[0-9]/.test(key)){
        inputDigit(e);
    }
    else if(/[-+*/=]/.test(key)){
        handleBinaryOperation(e);
    }
    else if(e.key === '.'){
        addDecimal();
    }
    else if(e.key === 'a' || e.key === 's'){
        handleUnaryOperation(e);
    }
    else if(e.key === 'Backspace'){
        deleteLastCharacter();
    }
    else if(e.key === 'x'){
        resetCalculator();
    }
}

// Check and add decimal point to current number
function addDecimal(){
    let currOutput = currentDisplay.textContent;
    
    if(!currOutput.includes('.')){
        currOutput += '.';
        clearcurrentDisplay = false;
    } 

    currentDisplay.textContent = currOutput;
}

// Handling unary operators
function handleUnaryOperation(e){
    let currOutput = Number(currentDisplay.textContent); 
    let input = (e.type == 'click') ? e.target.textContent : e.key;

    if(input === '+/-' || input === 'a'){
        currOutput *= -1;
    }
    else{
        // Rounding the number  upto precision factor
        currOutput = Math.round(Math.sqrt(currOutput) * sqrtPrecisionFactor) / sqrtPrecisionFactor;
        resetCalculator();
    }

    currentDisplay.textContent = currOutput;
}

// Evaluating binary operation
function handleBinaryOperation(e){
    let output = evaluate(previousOperator);
    
    // evaluating previous operation
    let newOperator = (e.type == 'click') ? e.target.textContent : e.key;   // current operator

    clearcurrentDisplay = true;

    // output the result and reset all parameters for starting new operations
    if(newOperator === '='){
        resetCalculator();
        currentDisplay.textContent = output;
        return;
    }

    currentDisplay.textContent = output;
    
    // displaying the previous operation
    previousDisplay.textContent = `${result} ${newOperator}`;
    previousOperator = newOperator;
}

function evaluate(operator){
    let curr = Number(currentDisplay.textContent);

    switch(operator){
        case '+':
            result += curr;
            break;
        case '-':
            result -= curr;
            break;
        case '*':
            result *= curr;
            break;
        case '/':
            result /= curr;
    }

    return result;
}

// Handling digit inputs
function inputDigit(e) {
    let digit = (e.type == 'click') ? e.target.textContent : e.key;
    let currentOutput = currentDisplay.textContent;

    if (clearcurrentDisplay) {
        currentOutput = '0';
        clearcurrentDisplay = false;
    }

    // Avoid leading zeroes
    if(currentOutput === '0' && digit === '0'){
        return;
    }

    if (currentOutput === '0'){
        currentOutput = '';
    } 

    // checking digit limit to avoid overflow
    if (currentOutput.length < inputDigitLimit) {
        currentDisplay.textContent = currentOutput + digit;
    }
}

// reset all parameters
function resetCalculator(){
    previousDisplay.textContent = "Nothing";
    currentDisplay.textContent = result = 0;
    clearcurrentDisplay = false;
    previousOperator = '+';
}

// deleting last digit from current number
function deleteLastCharacter(){
    let currentOutput = currentDisplay.textContent;
    
    currentOutput = currentOutput.slice(0, -1) || '0';
    
    currentDisplay.textContent = currentOutput;
}