export default {
  apiKey: 'd1f2115da3738ccac61045def57cbb1342d1eca11927eb58290c7cf3dd09debb',
  async fetchTickers(tickerName) {
    try {
      const data = await fetch(`https://min-api.cryptocompare.com/data/price?fsym=${tickerName}&tsyms=USD&api_key=${this.apiKey}`);
      return data.json();
    } catch (e) {
      console.log('error', e);
    }
  }
}

