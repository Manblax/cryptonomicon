const API_KEY = '9a3d0c7e344d216ed83593e3d89d067c4249db82d697fa671cfcdea23824fd67';

async function fetchTickers(tickerList) {
  try {
    const response = await fetch(`https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=${tickerList}&api_key=${API_KEY}`);
    const tickers = await response.json();
    return Object.fromEntries(Object.entries(tickers).map(([key, value]) => [key, 1 / value]));
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

export {fetchTickers, fetchCoinList}

