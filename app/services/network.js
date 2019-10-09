import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class NetworkService extends Service {
  @tracked onLine = window.navigator.onLine;
  callbacks = [];

  constructor() {
    super(...arguments);
    window.navigator.connection.addEventListener('change', this._handleConnectionChange);
  }

  willDestroy() {
    super.willDestroy(...arguments);
    window.navigator.connection.removeEventListener('change', this._handleConnectionChange);
  }

  onChange(callback) {
    this.callbacks.push(callback);
  }

  @action
  _handleConnectionChange() {
    this.callbacks.forEach(cb => cb(window.navigator.onLine))
  }
}
