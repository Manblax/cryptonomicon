class EventManager {
  constructor() {
    this._listeners = new Map();
  }

  subscribe(eventType, listener) {
    const subscribers = this._listeners.get(eventType) || [];
    this._listeners.set(eventType, [...subscribers, listener]);
  }

  unsubscribe(eventType, listener) {
    const subscribers = this._listeners.get(eventType) || [];
    this._listeners.set(eventType, subscribers.filter(fn => fn !== listener));
  }

  unsubscribeAll(eventType) {
    this._listeners.delete(eventType);
  }

  notify(eventType, data) {
    const listeners = this._listeners.get(eventType) ?? [];
    listeners.forEach(fn => fn(data));
  }
}

export {EventManager}