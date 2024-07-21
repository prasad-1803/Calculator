document.addEventListener("DOMContentLoaded", function() {
    const inputField = document.querySelector('.calculator__input');
    const resultField = document.querySelector('.calculator__output');
    let previousResult = '';
    let isResultDisplayed = false;

    document.querySelectorAll('.calculator__key').forEach(button => {
        button.addEventListener('click', () => {
            const buttonText = button.dataset.key;

            if (buttonText === 'AC') {
                inputField.value = '';
                resultField.textContent = '';
                previousResult = '';
                isResultDisplayed = false;
            } else if (buttonText === '⌫') {
                inputField.value = inputField.value.slice(0, -1);
                isResultDisplayed = false;
            } else if (buttonText === '=') {
                let expression = inputField.value
                    .replace(/×/g, '*')
                    .replace(/÷/g, '/');

                // Ensure the expression is valid
                const isValid = /^[\d+\-*/().\s]*$/.test(expression);

                console.log('Expression:', expression);


                if (isValid && expression.length > 0) {
                    try {
                        // Evaluate the expression
                        const result = eval(expression);
                        if (isNaN(result) || !isFinite(result)) {
                            throw new Error('Invalid Result');
                        }
                        resultField.textContent = result;
                        previousResult = result; // Store the result
                        isResultDisplayed = true;
                        // Do not clear the inputField value
                    } catch (e) {
                        resultField.textContent = 'Error';
                        previousResult = '';
                        isResultDisplayed = false;
                    }
                } else {
                    resultField.textContent = 'Invalid Expression';
                }
            } else {
                // If previousResult exists and isResultDisplayed is true, use previousResult
                if (previousResult && isResultDisplayed) {
                    // Append previous result to current input
                    inputField.value = previousResult + buttonText;
                    previousResult = '';
                    isResultDisplayed = false;
                } else {
                    // Append the button's value to the current input
                    inputField.value += buttonText;
                }
            }
        });
    });
});
