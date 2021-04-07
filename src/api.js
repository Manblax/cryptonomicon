const API_KEY = '9a3d0c7e344d216ed83593e3d89d067c4249db82d697fa671cfcdea23824fd67';
const tickers = new Map();

const socket = new WebSocket(`wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`);

socket.addEventListener('message', (event) => {
  //console.log(`[message] Данные получены с сервера: ${event.data}`);
  const data = JSON.parse(event.data);
  const tickerName = data.FROMSYMBOL

  if (tickers.has(tickerName)) {
    const cbList = tickers.get(tickerName);
    for (const cb of cbList) {
      cb(data.PRICE);
    }
  }
});


function fetchCoinList() {

}

function sendToWS(serializedMessage) {

  if (socket.readyState !== WebSocket.OPEN) {
    socket.addEventListener('open', () => {
      socket.send(serializedMessage);
      //console.log('serializedMessage', serializedMessage)
    });
  } else {
    socket.send(serializedMessage);
    //console.log('serializedMessage', serializedMessage)
  }
}

function subscribeToWS(tickerName) {
  const serializedMessage = JSON.stringify({
    "action": "SubAdd",
    "subs": [`5~CCCAGG~${tickerName}~USD`]
  });
  //console.log('subscribeToWS', tickerName)

  sendToWS(serializedMessage);
}

function unsubscribeFromWS(tickerName) {
  const serializedMessage = JSON.stringify({
    "action": "SubRemove",
    "subs": [`5~CCCAGG~${tickerName}~USD`]
  })
  //console.log('unsubscribeFromWS', tickerName)
  sendToWS(serializedMessage);
}


function subscribeToTicker(ticker, cb) {
  const subscribers = tickers.get('ticker') || [];
  tickers.set(ticker, [...subscribers, cb]);
  subscribeToWS(ticker);
}

function unsubscribeFromTicker(ticker, cb) {
  const subscribers = tickers.get('ticker') || [];
  tickers.set(ticker, subscribers.filter(fn => fn !== cb));

  unsubscribeFromWS(ticker);
}

window.tickers = tickers

socket.addEventListener('open', () => {
  //console.log("[open] Соединение установлено");
  //console.log("Отправляем данные на сервер");
  //socket.send("Меня зовут Джон");
});


socket.addEventListener('close', (event) => {
  if (event.wasClean) {
    console.log(`[close] Соединение закрыто чисто, код=${event.code} причина=${event.reason}`);
  } else {
    // например, сервер убил процесс или сеть недоступна
    // обычно в этом случае event.code 1006
    console.log('[close] Соединение прервано');
  }
});

socket.addEventListener('error', (error) => {
  console.log(`[error] ${error.message}`);
});

function fetchTickers() {
}

export {fetchTickers, fetchCoinList, subscribeToTicker, unsubscribeFromTicker}

