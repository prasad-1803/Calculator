document.addEventListener("DOMContentLoaded", function() {
    const inputField = document.querySelector('.calculator__input');
    const resultField = document.querySelector('.calculator__output');
    const logsTableBody = document.querySelector('#logsTable tbody'); // Ensure this matches your HTML ID
    let previousResult = '';
    let isResultDisplayed = false;

    const evaluateExpression = () => {
        let expression = inputField.value
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/%/g, '/100');
        
        const isValid = /^[\d+\-*/().\s]*$/.test(expression);
        const endsWithOperator = /[\d)]$/.test(expression);

        if (isValid && endsWithOperator && expression.length > 0) {
            try {
                const result = eval(expression);
                if (isNaN(result) || !isFinite(result)) {
                    throw new Error('Invalid Result');
                }
                resultField.textContent = result;
                return result;
            } catch (e) {
                resultField.textContent = 'Invalid Expression';
                return null;
            }
        } else {
            resultField.textContent = '';
            return null;
        }
    };

    const handleInput = (buttonText) => {
        let currentValue = inputField.value;
        const operatorRegex = /[\+\-×÷]/;
        currentValue = currentValue.replace(/([+\-×÷]){2,}/g, '$1');

        if (buttonText === '+') {
            if (operatorRegex.test(currentValue.slice(-1))) {
                inputField.value = currentValue.slice(0, -1) + buttonText;
            } else {
                inputField.value += buttonText;
            }
        } else if (buttonText === '-') {
            if (operatorRegex.test(currentValue.slice(-1))) {
                inputField.value = currentValue.slice(0, -1) + buttonText;
            } else {
                inputField.value += buttonText;
            }
        } else if (buttonText === '×') {
            if (operatorRegex.test(currentValue.slice(-1))) {
                inputField.value = currentValue.slice(0, -1) + buttonText;
            } else {
                inputField.value += buttonText;
            }
        } else if (buttonText === '÷') {
            if (operatorRegex.test(currentValue.slice(-1))) {
                inputField.value = currentValue.slice(0, -1) + buttonText;
            } else {
                inputField.value += buttonText;
            }
        } else {
            inputField.value += buttonText;
        }

        evaluateExpression();
    };

    const sendLog = async (expression, isValid, output) => {
        if (!expression) {
            alert('Expression is empty');
            return;
        }
        try {
            const response = await fetch('/api/logs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ expression, is_valid: isValid, output })
            });
            const result = await response.json();
            if (!response.ok) {
                alert(result.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchLogs = async () => {
        try {
            const response = await fetch('/api/logs');
            const logs = await response.json();
            logsTableBody.innerHTML = '';
            logs.forEach(log => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${log.id}</td>
                    <td>${log.expression}</td>
                    <td>${log.is_valid}</td>
                    <td>${log.output || 'N/A'}</td>
                    <td>${new Date(log.created_on).toLocaleString()}</td>
                `;
                logsTableBody.appendChild(row);
            });
        } catch (error) {
            console.error('Error:', error);
        }
    };

    document.querySelectorAll('.calculator__key').forEach(button => {
        button.addEventListener('click', async () => {
            const buttonText = button.dataset.key;

            if (buttonText === 'AC') {
                inputField.value = '';
                resultField.textContent = '';
                previousResult = '';
                isResultDisplayed = false;
            } else if (buttonText === '⌫') {
                inputField.value = inputField.value.slice(0, -1);
                evaluateExpression();
            } else if (buttonText === '=') {
                let expression = inputField.value
                    .replace(/×/g, '*')
                    .replace(/÷/g, '/')
                    .replace(/%/g, '/100');

                const isValid = /^[\d+\-*/().\s]*$/.test(expression);
                const endsWithOperator = /[\d)]$/.test(expression);

                if (isValid && endsWithOperator && expression.length > 0) {
                    try {
                        const result = eval(expression);
                        if (isNaN(result) || !isFinite(result)) {
                            throw new Error('Invalid Result');
                        }
                        inputField.value = result;
                        resultField.textContent = result;
                        previousResult = '';
                        isResultDisplayed = false;
                        await sendLog(expression, true, result);
                    } catch (e) {
                        resultField.textContent = 'Invalid Expression';
                        await sendLog(expression, false, null);
                    }
                } else {
                    resultField.textContent = 'Invalid Expression';
                    await sendLog(expression, false, null);
                }
            } else {
                handleInput(buttonText);
            }
        });
    });

    inputField.addEventListener('input', evaluateExpression);

    fetchLogs();
});
