const API_KEY = '9a3d0c7e344d216ed83593e3d89d067c4249db82d697fa671cfcdea23824fd67';
const tickers = new Map();

async function fetchTickers(tickerList) {
  try {
    const response = await fetch(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${tickerList}&tsyms=USD&api_key=${API_KEY}`);
    const tickers = await response.json();
    const a = {...Object.entries(tickers).map(([key, value]) => [key, value['USD']])}
    console.log('a', a, typeof a);
    return Object.fromEntries(Object.entries(tickers).map(([key, value]) => [key, value['USD']]));
  } catch (e) {
    console.log('error', e);
  }
}


async function fetchCoinList() {
  try {
    const response = await fetch('https://min-api.cryptocompare.com/data/all/coinlist?summary=true');
    return response.json();
  } catch (e) {
    console.log('error', e);
  }
}

function subscribeToTicker(ticker, cb) {
  const subscribers = tickers.get('ticker') || [];
  tickers.set(ticker, [...subscribers, cb]);
}

function unsubscribeFromTicker(ticker, cb) {
  const subscribers = tickers.get('ticker') || [];
  tickers.set(ticker, subscribers.filter(fn => fn !== cb));
}

window.tickers = tickers

export {fetchTickers, fetchCoinList, subscribeToTicker, unsubscribeFromTicker}

