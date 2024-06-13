import React, { useEffect, useState } from "react";
import { Block } from "./Block";
import "./index.scss";
import axios from "axios";

export const App = () => {
  const [fromCurrency, setFromCurrency] = useState("RUB");
  const [toCurrency, setToCurrency] = useState("USD");
  const [fromPrice, setFromPrice] = useState(0);
  const [toPrice, setToPrice] = useState(0);
  const [rates, setRates] = useState({});

  useEffect(() => {
    axios
      .get("https://www.cbr-xml-daily.ru/daily_json.js")
      .then((response) => {
        const fetchedRates = response.data.Valute;
        fetchedRates["RUB"] = { Value: 1 }; // Добавляем RUB как базовую валюту с курсом 1
        setRates(fetchedRates);
      })
      .catch((error) => {
        console.error(error);
        alert("Не удалось получить данные");
      });
  }, []);

  const onChangeFromPrice = (value) => {
    const numericValue = parseFloat(value) || 0;
    if (rates[fromCurrency] && rates[toCurrency]) {
      const fromRate = rates[fromCurrency].Value;
      const toRate = rates[toCurrency].Value;
      const priceInBaseCurrency = numericValue / fromRate;
      const result = priceInBaseCurrency * toRate;
      setFromPrice(numericValue);
      setToPrice(result);
    }
  };

  const onChangeToPrice = (value) => {
    const numericValue = parseFloat(value) || 0;
    if (rates[fromCurrency] && rates[toCurrency]) {
      const fromRate = rates[fromCurrency].Value;
      const toRate = rates[toCurrency].Value;
      const result = (numericValue * fromRate) / toRate;
      setToPrice(numericValue);
      setFromPrice(result);
    }
  };

  useEffect(() => {
    onChangeFromPrice(fromPrice);
  }, [fromCurrency]);

  useEffect(() => {
    onChangeToPrice(toPrice);
  }, [toCurrency]);

  return (
    <div className="App">
      <Block
        value={fromPrice}
        currency={fromCurrency}
        onChangeCurrency={setFromCurrency}
        onChangeValue={onChangeFromPrice}
      />
      <Block
        value={toPrice}
        currency={toCurrency}
        onChangeCurrency={setToCurrency}
        onChangeValue={onChangeToPrice}
      />
    </div>
  );
};
