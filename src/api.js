export default {
  apiKey: '9a3d0c7e344d216ed83593e3d89d067c4249db82d697fa671cfcdea23824fd67',
  async fetchTickers(tickerName) {
    try {
      const response = await fetch(`https://min-api.cryptocompare.com/data/price?fsym=${tickerName}&tsyms=USD&api_key=${this.apiKey}`);
      return response.json();
    } catch (e) {
      console.log('error', e);
    }
  },
  async fetchCoinList() {
    try {
      const response = await fetch('https://min-api.cryptocompare.com/data/all/coinlist?summary=true');
      return response.json();
    } catch (e) {
      console.log('error', e);
    }
  }
}

