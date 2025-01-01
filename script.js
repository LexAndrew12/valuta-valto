document.addEventListener('DOMContentLoaded', function() {
    const result = document.getElementById('result');
    const instructions = document.getElementById('instructions');
    const buttons = document.querySelectorAll('button');
    const submitButton = document.getElementById('submit-button');
    const rButton = document.getElementById('r-button');
    const hButton = document.getElementById('h-button');
    const addButton = document.getElementById('add-button');
    const minButton = document.getElementById('min-button');
    const ceButton = document.getElementById('ce-button');
    const backspaceButton = document.getElementById('backspace');
    const infoButton = document.getElementById('info-button');
    const infoPanel = document.getElementById('info-panel');
    const closeInfoButton = document.getElementById('close-info');
    const totalHUF = document.getElementById('total-huf');
    const totalRON = document.getElementById('total-ron');
    const newTotalHUF = document.getElementById('new-total-huf');
    const newTotalRON = document.getElementById('new-total-ron');

    let exchangeRate = 0;
    let conversionMode = '';
    let currentStep = 1;
    let totalAmountHUF = 0;
    let totalAmountRON = 0;
    let lastConvertedAmount = { HUF: 0, RON: 0 };

    function updateInstructions(step) {
        switch(step) {
            case 1:
                instructions.innerHTML = "Adja meg az árfolyamot:<br>1 RON = ? HUF<br>Majd nyomja meg a \"Bevitel\" gombot";
                break;
            case 2:
                instructions.innerHTML = "Válassza a váltási módot:<br>R: RON → HUF<br>H: HUF → RON";
                break;
            case 3:
                let currency = conversionMode === 'RON-HUF' ? 'RON' : 'HUF';
                instructions.innerHTML = `Adja meg az összeget (${currency})<br>majd nyomja meg a \"Bevitel\" gombot`;
                break;
        }
    }

    function updateTotalDisplay() {
        totalHUF.textContent = `${totalAmountHUF.toFixed(2)} HUF`;
        totalRON.textContent = `${totalAmountRON.toFixed(2)} RON`;
    }

    function updateNewTotalDisplay() {
        let newTotalHUFAmount = totalAmountHUF + lastConvertedAmount.HUF;
        let newTotalRONAmount = totalAmountRON + lastConvertedAmount.RON;
        newTotalHUF.textContent = `${newTotalHUFAmount.toFixed(2)} HUF`;
        newTotalRON.textContent = `${newTotalRONAmount.toFixed(2)} RON`;
    }

    function resetNewTotalDisplay() {
        newTotalHUF.textContent = `${totalAmountHUF.toFixed(2)} HUF`;
        newTotalRON.textContent = `${totalAmountRON.toFixed(2)} RON`;
    }

    function resetCalculator() {
        exchangeRate = 0;
        conversionMode = '';
        currentStep = 1;
        totalAmountHUF = 0;
        totalAmountRON = 0;
        lastConvertedAmount = { HUF: 0, RON: 0 };
        result.value = '';
        updateInstructions(currentStep);
        updateTotalDisplay();
        resetNewTotalDisplay();
    }

    updateInstructions(currentStep);

    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (button.classList.contains('number') || button.classList.contains('decimal')) {
                result.value += button.textContent;
            } else if (button.classList.contains('clear')) {
                result.value = '';
            }
        });
    });

    backspaceButton.addEventListener('click', function() {
        result.value = result.value.slice(0, -1);
    });

    infoButton.addEventListener('click', function() {
        infoPanel.classList.toggle('hidden');
    });

    closeInfoButton.addEventListener('click', function() {
        infoPanel.classList.add('hidden');
    });

    submitButton.addEventListener('click', function() {
        if (currentStep === 1) {
            exchangeRate = parseFloat(result.value);
            if (!isNaN(exchangeRate) && exchangeRate > 0) {
                currentStep = 2;
                result.value = '';
                updateInstructions(currentStep);
            } else {
                alert("Adjon meg érvényes pozitív számot!");
            }
        } else if (currentStep === 3) {
            let amount = parseFloat(result.value);
            if (!isNaN(amount) && amount > 0) {
                let convertedAmount;
                if (conversionMode === 'RON-HUF') {
                    convertedAmount = amount * exchangeRate;
                    result.value = `${amount} RON = ${convertedAmount.toFixed(2)} HUF`;
                    lastConvertedAmount = { RON: amount, HUF: convertedAmount };
                } else {
                    convertedAmount = amount / exchangeRate;
                    result.value = `${amount} HUF = ${convertedAmount.toFixed(2)} RON`;
                    lastConvertedAmount = { HUF: amount, RON: convertedAmount };
                }
                updateNewTotalDisplay();
            } else {
                alert("Adjon meg érvényes pozitív számot!");
            }
        }
    });

    rButton.addEventListener('click', function() {
        if (currentStep === 2) {
            conversionMode = 'RON-HUF';
            currentStep = 3;
            result.value = '';
            updateInstructions(currentStep);
        }
    });

    hButton.addEventListener('click', function() {
        if (currentStep === 2) {
            conversionMode = 'HUF-RON';
            currentStep = 3;
            result.value = '';
            updateInstructions(currentStep);
        }
    });

    addButton.addEventListener('click', function() {
        if (currentStep === 3 && lastConvertedAmount.HUF > 0 && lastConvertedAmount.RON > 0) {
            totalAmountHUF += lastConvertedAmount.HUF;
            totalAmountRON += lastConvertedAmount.RON;
            updateTotalDisplay();
            lastConvertedAmount = { HUF: 0, RON: 0 };
            resetNewTotalDisplay();
            result.value = '';
        }
    });

    minButton.addEventListener('click', function() {
        if (currentStep === 3) {
            let amount = parseFloat(result.value);
            if (!isNaN(amount) && amount > 0) {
                let convertedAmount;
                if (conversionMode === 'RON-HUF') {
                    convertedAmount = amount * exchangeRate;
                    totalAmountRON -= amount;
                    totalAmountHUF -= convertedAmount;
                } else {
                    convertedAmount = amount / exchangeRate;
                    totalAmountHUF -= amount;
                    totalAmountRON -= convertedAmount;
                }
                updateTotalDisplay();
                resetNewTotalDisplay(); // Add this line
                result.value = '';
            } else {
                alert("Adjon meg érvényes pozitív számot!");
            }
        }
    });

    ceButton.addEventListener('click', function() {
        resetCalculator();
    });
});
