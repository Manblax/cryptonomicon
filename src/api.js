export default {
  apiKey: 'd1f2115da3738ccac61045def57cbb1342d1eca11927eb58290c7cf3dd09debb',
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

