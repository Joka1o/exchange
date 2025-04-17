const API_BASE = "http://localhost:3000/api/rates";

async function updateTickerRates() {
  try {
    const response = await fetch(API_BASE);
    const data = await response.json();

    const currencies = ["USD", "EUR", "PLN", "CZK", "CNY"];

    currencies.forEach(code => {
      const rateObj = data.find(item => item.cc === code);
      if (rateObj) {
        const el = document.getElementById(`rate-${code.toLowerCase()}`);
        if (el) {
          el.textContent = `${code} = ${rateObj.rate.toFixed(2)}`;
        }
      }
    });
  } catch (error) {
    console.error("Помилка при оновленні тікеру:", error);
  }
}


// ONE — USD
async function fetchSingleRate() {
  try {
    const response = await fetch(API_BASE);
    const data = await response.json();

    const usdRateObj = data.find(item => item.cc === "USD");

    if (usdRateObj) {
      document.getElementById("rate-usd-single").textContent = `${usdRateObj.rate.toFixed(2)} UAH`;
    } else {
      document.getElementById("rate-usd-single").textContent = "Немає даних!";
    }
  } catch (error) {
    console.error(error);
    document.getElementById("rate-usd-single").textContent = "Помилка!";
  }
}

// TWO — список USD, EUR, PLN
async function fetchAllRates() {
  try {
    const response = await fetch(API_BASE);
    const data = await response.json();

    let result = "";
    const neededCodes = ["USD", "EUR", "PLN"];

    neededCodes.forEach(code => {
      const rateObj = data.find(item => item.cc === code);
      if (rateObj) {
        result += `${code}: ${rateObj.rate.toFixed(2)} UAH<br>`;
      }
    });

    document.getElementById("rate-all").innerHTML = result || "Немає даних!";
  } catch (error) {
    console.error(error);
    document.getElementById("rate-all").textContent = "Помилка!";
  }
}

// THREE — випадаючий список + "Отримати"
async function populateCurrencyDropdownList() {
  try {
    const response = await fetch(API_BASE);
    const data = await response.json();

    const dropdown = document.getElementById("currency-list");
    dropdown.innerHTML = "<option value=''>Оберіть валюту</option>";

    data.forEach(item => {
      // Перевірка, щоб rate був більше 0
      if (item.rate && item.rate > 0.01) {
        const option = document.createElement("option");
        option.value = item.cc;
        option.textContent = `${item.cc} - ${item.txt}`;
        dropdown.appendChild(option);
      }
    });
  } catch (error) {
    console.error("Помилка при завантаженні валют у калькулятор:", error);
  }
}

async function fetchCheckedCurrencies() {
  const selectedCurrency = document.getElementById("currency-list").value;

  if (!selectedCurrency) {
    document.getElementById("rate-alls").textContent = "Оберіть валюту!";
    return;
  }

  try {
    const response = await fetch(API_BASE);
    const data = await response.json();

    const rateObj = data.find(item => item.cc === selectedCurrency);

    if (rateObj) {
      document.getElementById("rate-alls").textContent = `${rateObj.txt} (${rateObj.cc}): ${rateObj.rate.toFixed(2)} UAH`;
    } else {
      document.getElementById("rate-alls").textContent = "Немає даних!";
    }

  } catch (error) {
    console.error(error);
    document.getElementById("rate-alls").textContent = "Помилка при завантаженні курсів.";
  }
}

// FOUR — калькулятор
async function calculateCurrency() {
  const currency = document.getElementById("currencySelect").value;
  const amount = parseFloat(document.getElementById("amountInput").value);

  try {
    const response = await fetch(API_BASE);
    const data = await response.json();

    const rateObj = data.find(item => item.cc === currency);

    if (rateObj) {
      const result = amount * rateObj.rate;
      document.getElementById("calculatedResult").textContent = `Результат: ${result.toFixed(2)} UAH`;
    } else {
      document.getElementById("calculatedResult").textContent = "Курс не знайдено!";
    }
  } catch (error) {
    console.error(error);
    document.getElementById("calculatedResult").textContent = "Помилка!";
  }
}

// Автозапуск
window.addEventListener("DOMContentLoaded", () => {
  fetchSingleRate();
  fetchAllRates();
  populateCurrencyDropdownList();
  updateTickerRates()
});
//Щоб запрацював сервер необхідно написати в терміналі node server.js тоді відкриє сервер з якого ми вже будемо брати дані по валютах