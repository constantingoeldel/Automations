import { Client } from "@notionhq/client";
import { config } from "dotenv";
import request from "request";
import { appendFile } from "fs";
import cron from "node-cron";
config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const stockToken = process.env.STOCK_API_KEY;

async function updateCurrentPrice(id, newPrice) {
  try {
    notion.pages.update({
      page_id: id,
      properties: {
        "Current price/unit": {
          number: newPrice,
        },
      },
    });
  } catch (error) {
    console.error("Error when updating:", error);
  }
}

async function getCurrentCryptoPrice(from) {
  const url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${from}&to_currency=EUR&apikey=${stockToken}`;
  const result = await new Promise((resolve, reject) => {
    request.get(
      {
        url: url,
        json: true,
        headers: { "User-Agent": "request" },
      },
      (err, res, data) => {
        if (err) {
          reject("Error:", err);
        } else if (res.statusCode !== 200) {
          reject("Status:", res.statusCode);
        } else {
          resolve(Number(data["Realtime Currency Exchange Rate"]["5. Exchange Rate"]));
        }
      }
    );
  });
  return result;
}
async function dollarToEuro() {
  const url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=EUR&apikey=${stockToken}`;
  const result = await new Promise((resolve, reject) => {
    request.get(
      {
        url: url,
        json: true,
        headers: { "User-Agent": "request" },
      },
      (err, res, data) => {
        if (err) {
          saveError(err);
          reject("Error:", err);
        } else if (res.statusCode !== 200) {
          saveError("Wrong Status code: " + res.statusCode);
          reject("Status:", res.statusCode);
        } else if (!data["Realtime Currency Exchange Rate"]) {
          console.log(data);
        } else {
          resolve(Number(data["Realtime Currency Exchange Rate"]["5. Exchange Rate"]));
        }
      }
    );
  });
  return result;
}

async function getCurrentStockPrice(symbol) {
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&&apikey=${stockToken}`;
  const result = await new Promise((resolve, reject) => {
    request.get(
      {
        url: url,
        json: true,
        headers: { "User-Agent": "request" },
      },
      (err, res, data) => {
        if (err) {
          saveError(err);
          reject("Error:", err);
        } else if (res.statusCode !== 200) {
          saveError("Wrong status code: " + res.statusCode);
          reject("Status:", res.statusCode);
        } else {
          resolve(Number(Object.values(data["Time Series (5min)"])[0]["4. close"]));
        }
      }
    );
  });
  return result;
}

const stocks = [
  { name: "Apple", symbol: "AAPL", page: process.env.NOTION_APPLE_PAGE_ID },
  { name: "Disney", symbol: "DIS", page: process.env.NOTION_DISNEY_PAGE_ID },
  { name: "Amazon", symbol: "AMZN", page: process.env.NOTION_AMAZON_PAGE_ID },
];

const cryptos = [
  { name: "Etherium", symbol: "ETH", page: process.env.NOTION_ETHERIUM_PAGE_ID },
  { name: "Cardano", symbol: "ADA", page: process.env.NOTION_CARDANO_PAGE_ID },
  { name: "Solana", symbol: "SOL", page: process.env.NOTION_SOLANA_PAGE_ID },
];

async function updateInvestmentDatabase() {
  await Promise.all(
    stocks.map(async (stock) => {
      stock.price = await getCurrentStockPrice(stock.symbol);
    })
  );
  await new Promise((resolve) => setTimeout(resolve, 60000));
  await Promise.all(
    cryptos.map(async (crypto) => {
      crypto.price = await getCurrentCryptoPrice(crypto.symbol);
    })
  );
  const exchangeRate = await dollarToEuro();
  stocks.forEach((stock) => {
    stock.price = stock.price * exchangeRate;
    updateCurrentPrice(stock.page, stock.price);
  });
  cryptos.forEach((crypto) => updateCurrentPrice(crypto.page, crypto.price));
  saveResults(stocks, cryptos);
  console.table(stocks);
  console.table(cryptos);
  console.log("Update finished successfully. Next update in 5 minutes");
}

function saveResults(stocks = [], cryptos = [], fonds = []) {
  const content = `{
	"time": ${Date.now()},
        "result": {
            "stocks": ${JSON.stringify(stocks)},
            "cryptos": ${JSON.stringify(cryptos)},
            "fonds": ${JSON.stringify(fonds)}
        }},`;
  appendFile("log.json", content, (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
}

function saveError(error) {
  appendFile("errors.txt", error, (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
}
updateInvestmentDatabase();
cron.schedule("*/5 * * * * ", () => {
  updateInvestmentDatabase();
});
