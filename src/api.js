import {EventManager} from "./utils/EventManager";

async function fetchCoinList() {
  try {
    const response = await fetch('https://min-api.cryptocompare.com/data/all/coinlist?summary=true');
    return response.json();
  } catch (e) {
    console.log('error', e);
  }
}

class Ticker {
  static AGGREGATE_INDEX = "5";
  static API_KEY = '9a3d0c7e344d216ed83593e3d89d067c4249db82d697fa671cfcdea23824fd67';

  constructor() {
    this.socket = new WebSocket(`wss://streamer.cryptocompare.com/v2?api_key=${Ticker.API_KEY}`);
    this.events = new EventManager();
    this.initListeners();
  }

  sendToWebSocket(message) {
    const stringifiedMessage = JSON.stringify(message);

    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(stringifiedMessage);
      return;
    }

    this.socket.addEventListener(
      "open",
      () => this.socket.send(stringifiedMessage),
      {once: true}
    );
  }

  subscribeToTickerOnWs(ticker) {
    this.sendToWebSocket({
      action: "SubAdd",
      subs: [`5~CCCAGG~${ticker}~USD`]
    });
  }

  unsubscribeFromTickerOnWs(ticker) {
    this.sendToWebSocket({
      action: "SubRemove",
      subs: [`5~CCCAGG~${ticker}~USD`]
    });
  }

  subscribeToTicker(ticker, cb) {
    this.events.subscribe(ticker, cb);
    this.subscribeToTickerOnWs(ticker);
  }

  unsubscribeFromTicker(ticker, cb) {
    this.events.unsubscribe(ticker, cb);
    this.unsubscribeFromTickerOnWs(ticker);
  }

  initListeners() {
    this.socket.addEventListener("message", event => {
      let tickerData;

      try {
        tickerData = JSON.parse(event.data);
      } catch (e) {
        console.log(e);
        return;
      }

      const {TYPE: type, FROMSYMBOL: currency, PRICE: newPrice} = tickerData;

      if (type !== Ticker.AGGREGATE_INDEX || newPrice === undefined) {
        return;
      }

      this.events.notify(currency, newPrice);
    });

    this.socket.addEventListener('open', () => {
      console.log("Ticker WS [open]  Соединение установлено");
    });

    this.socket.addEventListener('close', (event) => {
      if (event.wasClean) {
        console.log(`Ticker WS [close] Соединение закрыто чисто, код=${event.code} причина=${event.reason}`);
      } else {
        console.log('Ticker WS [close] Соединение прервано');
      }
    });

    this.socket.addEventListener('error', (error) => {
      console.log(`Ticker WS [error] ${error.message}`);
    });
  }
}

const tickerApi = new Ticker();

export {fetchCoinList, tickerApi}

