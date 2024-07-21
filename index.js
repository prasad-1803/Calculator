document.addEventListener("DOMContentLoaded", function() {
    const inputField = document.querySelector('.calculator__input');
    const resultField = document.querySelector('.calculator__output');
    let previousResult = '';
    let isResultDisplayed = false;

    // Function to evaluate the expression
    const evaluateExpression = () => {
        let expression = inputField.value
            .replace(/×/g, '*')  // Replace '×' with '*'
            .replace(/÷/g, '/')  // Replace '÷' with '/'
            .replace(/%/g, '/100'); // Replace '%' with '/100'

        // Ensure the expression contains only valid characters
        const isValid = /^[\d+\-*/().\s]*$/.test(expression);
        // Check if the expression ends with a valid character
        const endsWithOperator = /[\d)]$/.test(expression);

        if (isValid && endsWithOperator && expression.length > 0) {
            try {
                const result = eval(expression);
                if (isNaN(result) || !isFinite(result)) {
                    throw new Error('Invalid Result');
                }
                resultField.textContent = result; // Show result in the result field
            } catch (e) {
                resultField.textContent = 'Invalid Expression'; // Show error message
            }
        } else {
            resultField.textContent = ''; // Clear result if expression is invalid
        }
    };

    // Add click event listeners to all calculator buttons
    document.querySelectorAll('.calculator__key').forEach(button => {
        button.addEventListener('click', () => {
            const buttonText = button.dataset.key; // Get the value of the clicked button

            if (buttonText === 'AC') {
                // Clear everything
                inputField.value = '';
                resultField.textContent = '';
                previousResult = '';
                isResultDisplayed = false;
            } else if (buttonText === '⌫') {
                // Remove the last character
                inputField.value = inputField.value.slice(0, -1);
                evaluateExpression(); // Recalculate after deletion
            } else if (buttonText === '=') {
                // Calculate and show the result
                let expression = inputField.value
                    .replace(/×/g, '*')
                    .replace(/÷/g, '/')
                    .replace(/%/g, '/100'); // Handle percentage

                const isValid = /^[\d+\-*/().\s]*$/.test(expression);
                const endsWithOperator = /[\d)]$/.test(expression);

                if (isValid && endsWithOperator && expression.length > 0) {
                    try {
                        const result = eval(expression);
                        if (isNaN(result) || !isFinite(result)) {
                            throw new Error('Invalid Result');
                        }
                        inputField.value = result; // Transfer result to input field
                        resultField.textContent = result; // Show result
                        previousResult = '';
                        isResultDisplayed = false;
                    } catch (e) {
                        resultField.textContent = 'Invalid Expression'; // Show error message
                    }
                } else {
                    resultField.textContent = 'Invalid Expression'; // Show error message
                }
            } else {
                // Append to input field but only update result
                if (previousResult && isResultDisplayed) {
                    inputField.value = previousResult + buttonText;
                    previousResult = '';
                    isResultDisplayed = false;
                } else {
                    inputField.value += buttonText;
                }
                evaluateExpression(); // Recalculate after adding a new character
            }
        });
    });

    // Recalculate the expression whenever the user types in the input field
    inputField.addEventListener('input', evaluateExpression);
});
