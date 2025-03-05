document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.querySelector(".last-exchange__toggle");
    let hiddenItems = [];
    let isOpen = false;
    
//    async function fetchExchangeData() {
//        try {
//            // Заглушка
//            const data = [
//                { date: "03.01.2025", amount: "30 000", converted: "29,940", currencyFrom: "USDT", currencyTo: "USD", rate: "0.998" },
//                { date: "03.01.2025", amount: "120,000", converted: "45,285", currencyFrom: "RUB", currencyTo: "TRY", rate: "2.65" },
//                { date: "03.01.2025", amount: "8,200", converted: "287,840", currencyFrom: "USDT", currencyTo: "TRY", rate: "35.98" },
//                { date: "03.01.2025", amount: "10,000", converted: "9,561", currencyFrom: "USDT", currencyTo: "EUR", rate: "0.9561" },
//                { date: "03.01.2025", amount: "5,500", converted: "54,89", currencyFrom: "USDT", currencyTo: "USD", rate: "0.998" },
//                { date: "03.01.2025", amount: "82,000", converted: "30,943", currencyFrom: "RUB", currencyTo: "TRY", rate: "2.65" },
//                { date: "03.01.2025", amount: "800", converted: "28,780", currencyFrom: "USDT", currencyTo: "TRY", rate: "35.98" },
//                { date: "03.01.2025", amount: "21,450", converted: "20,508", currencyFrom: "USDT", currencyTo: "EUR", rate: "0.9561" }
//            ];
//            updateExchangeRates(data);
//        } catch (error) {
//            console.error("Ошибка", error);
//        }
//    }

    async function fetchExchangeData() {
        try {
            const response = await fetch('https://tri-prep-shadow-tomatoes.trycloudflare.com/api/v1/rates/');
            if (!response.ok) {
                throw new Error('Сеть ответила с ошибкой: ' + response.status);
            }
            const data = await response.json(); // Парсим JSON-ответ
            updateExchangeRates(data); // Обновляем данные
        } catch (error) {
            console.error("Ошибка", error);
        }
    }

    function updateExchangeRates(data) {
        const items = document.querySelectorAll(".last-exchange__item");
        data.forEach((exchange, index) => {
            if (items[index]) {
                items[index].querySelector(".last-exchange__date").textContent = exchange.date;
                items[index].querySelector(".last-exchange__rate").textContent = `${exchange.amount} ${exchange.currencyFrom} → ${exchange.converted} ${exchange.currencyTo}`;
                items[index].querySelector(".last-exchange__course").textContent = `1 ${exchange.currencyFrom} = ${exchange.rate} ${exchange.currencyTo}`;
    
                const rateElement = items[index].querySelector(".last-exchange__rate");
                if (rateElement) {
                    rateElement.innerHTML = rateElement.innerHTML.replace(
                        "→",
                        `<span class="arrow" style="color: rgb(148, 163, 184);">→</span>`
                    );
                }
            }
        });
    }
    
    function init() {
        const items = document.querySelectorAll(".last-exchange__item");
        const isDesktop = window.matchMedia("(min-width: 768px)").matches;
        
        items.forEach((item, index) => {
            if (isDesktop && index >= 4) {
                item.classList.add("last-exchange__item--hidden");
                hiddenItems.push(item);
            } else if (!isDesktop && index >= 2) {
                item.classList.add("last-exchange__item--hidden");
                hiddenItems.push(item);
            }
        });
    }
    
    init();
    fetchExchangeData(); 
    
    toggleButton.addEventListener("click", function () {
        isOpen = !isOpen;
        const showItems = window.matchMedia("(min-width: 768px)").matches ? 4 : 6;
        
        hiddenItems.slice(0, showItems).forEach(item => {
            item.classList.toggle("last-exchange__item--hidden", !isOpen);
        });
        
        this.classList.toggle("last-exchange__toggle--open", isOpen);
    });
    
    setInterval(fetchExchangeData, 10000); 
});