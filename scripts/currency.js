document.addEventListener('DOMContentLoaded', function() {
    initSelects();
    selectOption('usdt', 'currency');
    updateReceivedAmount();
});

function initSelects() {
    const selects = {
        currency: {
            selector: '.currency-select .custom-select__selected',
            defaultValue: 'usdt'
        },
        city: {
            selector: '.city-select .custom-select__selected',
            defaultValue: 'antalya' 
        },
        receive: {
            selector: '#receive-selected',
            defaultValue: 'try'
        }
    };

    Object.entries(selects).forEach(([type, config]) => {
        const selected = document.querySelector(config.selector);
        if (selected && !selected.dataset.value) {
            selected.dataset.value = config.defaultValue;
            if (type === 'receive') initReceiveOptions();
        }
    });

    const defaultCity = 'antalya';
    const cityButtons = document.querySelectorAll('.currency-rates__button');
    cityButtons.forEach(button => {
        if (button.dataset.city === defaultCity) {
            button.classList.add('currency-rates__button--active');
        } else {
            button.classList.remove('currency-rates__button--active');
        }
    });
}

function initReceiveOptions() {
    updateReceiveOptions('usdt');
}

function updateReceiveOptions(selectedCurrency) {
    const receiveOptions = {
        usdt: [
            {value: "usd", text: "USD наличные", icon: "./assets/images/usd-icon.svg"},
            {value: "try", text: "TRY наличные", icon: "./assets/images/try-icon.svg"},
            {value: "eur", text: "EUR наличные", icon: "./assets/images/eur-icon.svg"}
        ],
        rub: [
            {value: "try", text: "TRY наличные", icon: "./assets/images/try-icon.svg"},
        ],
        uah: [
            {value: "try", text: "TRY наличные", icon: "./assets/images/try-icon.svg"}
        ],
        usd: [
            {value: "usdt", text: "Tether USDT", icon: "./assets/images/usdt-icon.svg"},
        ],
        eur: [
            {value: "usdt", text: "Tether USDT", icon: "./assets/images/usdt-icon.svg"}
        ]
    };

    const optionsContainer = document.getElementById("receive-select-options");
    optionsContainer.innerHTML = '';

    if (receiveOptions[selectedCurrency]) {
        receiveOptions[selectedCurrency].forEach(option => {
            const div = document.createElement("div");
            div.className = "custom-select__option";
            div.dataset.value = option.value;
            div.onclick = () => selectOption(option.value, 'receive');
            div.innerHTML = `
                <img src="${option.icon}" class="custom-select__icon" alt="${option.value}-icon">
                <span class="custom-select__text">${option.text}</span>
            `;
            optionsContainer.appendChild(div);
        });
    }

    if (receiveOptions[selectedCurrency]?.[0]) {
        const firstOption = receiveOptions[selectedCurrency][0];
        const selected = document.querySelector("#receive-selected");
        selected.innerHTML = `
            <div class="currency-preview">
                <img src="${firstOption.icon}" class="custom-select__icon" alt="${firstOption.value}-icon">
                <svg class="header__custom-select-arrow" viewBox="0 -4.5 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 1.39 18.594 0 9.987 8.261l-.918-.881.005.005L1.427.045 0 1.414 9.987 11z" fill-rule="evenodd"/>
                </svg>
            </div>
        `;
        selected.dataset.value = firstOption.value;
    }
}

function toggleCustomSelect(type) {
    const optionsMap = {
        currency: "#custom-select-options",
        city: "#city-select-options",
        receive: "#receive-select-options"
    };

    const link = document.querySelector(".header__link");
    const options = document.querySelector(optionsMap[type]);

    if (!options || !link) return;

    Object.values(optionsMap).forEach(selector => {
        const otherOptions = document.querySelector(selector);
        if (selector !== optionsMap[type]) {
            otherOptions.classList.remove('show');
        }
    });

    const wasOpen = options.classList.contains('show');
    options.classList.toggle('show');

    if (type === 'currency') {
        const windowWidth = window.innerWidth;
        link.style.marginTop = options.classList.contains('show') 
            ? (windowWidth > 920 ? "180px" : "64px")
            : "64px";
    } else {
        if (wasOpen) link.style.marginTop = "64px";
    }
}

function selectOption(value, type) {
    const selectors = {
        currency: {
            selected: ".currency-select .custom-select__selected",
            options: "#custom-select-options"
        },
        city: {
            selected: ".city-select .custom-select__selected",
            options: "#city-select-options"
        },
        receive: {
            selected: "#receive-selected",
            options: "#receive-select-options"
        }
    };

    const config = selectors[type];
    if (!config) return;

    const selectedElement = document.querySelector(config.selected);
    const optionsContainer = document.querySelector(config.options);

    if (optionsContainer) {
        const selectedOption = Array.from(optionsContainer.children)
            .find(option => option.dataset.value === value);

        if (selectedOption) {
            switch(type) {
                case 'city':
                    selectedElement.innerHTML = selectedOption.innerHTML;
                    selectedElement.dataset.value = value;
                    break;
                    
                case 'currency':
                    selectedElement.innerHTML = selectedOption.innerHTML;
                    selectedElement.dataset.value = value;
                    updateReceiveOptions(value);
                    break;
                    
                case 'receive':
                    const iconSrc = selectedOption.querySelector('img').src;
                    selectedElement.innerHTML = `
                        <div class="currency-preview">
                            <img src="${iconSrc}" class="custom-select__icon" alt="${value}-icon">
                            <svg class="header__custom-select-arrow" viewBox="0 -4.5 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 1.39 18.594 0 9.987 8.261l-.918-.881.005.005L1.427.045 0 1.414 9.987 11z" fill-rule="evenodd"/>
                            </svg>
                        </div>
                    `;
                    selectedElement.dataset.value = value;
                    break;
            }
            
            optionsContainer.classList.remove('show');
            if (type === 'currency') {
                document.querySelector(".header__link").style.marginTop = "64px";
            }
        }
    }
    updateReceivedAmount();
}

async function updateReceivedAmount() {
    const amountInput = document.getElementById("amount");
    const amount = parseFloat(amountInput.value);
    const currency = document.querySelector(".currency-select .custom-select__selected")?.dataset.value;
    const receiveCurrency = document.querySelector("#receive-selected")?.dataset.value;
    const outputElement = document.getElementById("received-amount");

    if (!amount || amount <= 0 || isNaN(amount) || !currency || !receiveCurrency) {
        outputElement.style.opacity = '0';
        outputElement.style.width = '0';
        return;
    }

    try {
        const exchangeRates = await fetchExchangeRates(currency, receiveCurrency, amount);
        if (exchangeRates?.rate) {
            outputElement.textContent = (amount * exchangeRates.rate).toFixed(2);
            outputElement.style.opacity = '1';
            outputElement.style.width = 'auto';
        } else {
            outputElement.textContent = "Ошибка курса";
        }
    } catch (error) {
        console.error("Ошибка:", error);
        outputElement.textContent = "Ошибка";
    }
}

function validateInput(event) {
    const charCode = event.which || event.keyCode;
    const value = event.target.value;
    
    if ((charCode === 46 && value.includes('.')) || 
        (charCode !== 46 && charCode > 31 && (charCode < 48 || charCode > 57))) {
        return false;
    }
    return true;
}

document.addEventListener('click', function(e) {
    if (!e.target.closest('.custom-select')) {
        document.querySelectorAll('.custom-select__options').forEach(options => {
            options.classList.remove('show');
        });

        const currencyOptions = document.querySelector("#custom-select-options");
        if (currencyOptions.classList.contains('show')) {
            document.querySelector(".header__link").style.marginTop = "64px";
        }
    }
});


//
//async function fetchExchangeRates(fromCurrency, toCurrency, amount) {
//
//    const mockRates = {
//        'usdt-usd': [
//            { min: 1000, max: 20000, rate: 0.996 },
//            { min: 20000, max: 50000, rate: 0.997 },
//            { min: 50000, max: Infinity, rate: 0.998 }
//        ],
//        'usdt-eur': [
//            { min: 0, max: 1000, rate: 0.9523 },
//            { min: 20000, max: 50000, rate: 0.9562 },
//            { min: 50000, max: Infinity, rate: 0.9581 }
//        ],
//        'usdt-try': [
//            { min: 300, max: 1000, rate: 35.83 },
//            { min: 1000, max: Infinity, rate: 36.01 }
//        ],
//        'usd-usdt': [
//            { min: 5000, max: 20000, rate: 0.988 },
//            { min: 20000, max: 50000, rate: 0.989 },
//            { min: 50000, max: Infinity, rate: 0.990 }
//        ],
//        'eur-usdt': [
//            { min: 5000, max: 20000, rate: 1.0337 },
//            { min: 20000, max: 50000, rate: 1.0357 },
//            { min: 50000, max: Infinity, rate: 1.0368 }
//        ],
//        'rub-try': [
//            { min: 30000, max: 150000, rate: 2.70 },
//            { min: 150000, max: Infinity, rate: 2.65 }
//        ],
//        'uah-try': [
//            { min: 20000, max: 50000, rate: 0.89 },
//            { min: 50000, max: Infinity, rate: 0.88 }
//        ]
//    };
//
//
//    const rateConfigs = mockRates[`${fromCurrency}-${toCurrency}`];
//    if (!rateConfigs) return null;
//
//    const rateConfig = rateConfigs.find(range => amount >= range.min && amount < range.max);
//    return rateConfig ? { rate: rateConfig.rate } : null;
//}

document.getElementById("amount").addEventListener("input", updateReceivedAmount);
document.querySelectorAll('.custom-select').forEach(select => {
    select.addEventListener("click", function(e) {
        if (!e.target.closest('.custom-select__option')) {
            const type = this.classList.contains('city-select') ? 'city' 
                : this.classList.contains('receive-select') ? 'receive' 
                : 'currency';
            toggleCustomSelect(type);
        }
    });
});

document.querySelectorAll('.currency-rates__button').forEach(button => {
    button.addEventListener('click', function() {
        document.querySelectorAll('.currency-rates__button').forEach(btn => {
            btn.classList.remove('currency-rates__button--active');
        });

        this.classList.add('currency-rates__button--active');

        const selectedCity = this.dataset.city;
        selectOption(selectedCity, 'city');
    });
});





async function fetchExchangeRates(fromCurrency, toCurrency, amount) {
    const apiUrl = `http://45.12.143.146:5001/api/v1/rates_tuple/?fromCurrency=${fromCurrency}&toCurrency=${toCurrency}&amount=${amount}`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Ошибка');
        }
        const data = await response.json();
        console.error("Все ок!:", data);
        return { rate: data.rate }; // Предполагаем, что API возвращает курс в поле `rate`
    } catch (error) {
        console.error("Ошибка при запросе курса:", error);
        return null;
    }

}

