document.addEventListener("DOMContentLoaded", function() {
    const inputField = document.querySelector('.calculator__input');
    const resultField = document.querySelector('.calculator__output');
    const buttons = document.querySelectorAll('.calculator__key');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const buttonText = button.dataset.key;
            if (buttonText === 'AC') {
                inputField.value = '';
                resultField.textContent = '';
            } else if (buttonText === '⌫') {
                inputField.value = inputField.value.slice(0, -1);
            } else if (buttonText === '=') {
                try {
                    const result = eval(inputField.value.replace(/×/g, '*').replace(/÷/g, '/'));
                    resultField.textContent = result;
                } catch (e) {
                    resultField.textContent = 'Error';
                }
            } else {
                inputField.value += buttonText;
            }
        });
    });
});
