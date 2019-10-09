import { RequestStrategy } from '@orbit/coordinator';

export default {
  create() {
    return new RequestStrategy({
      name: 'remote-updatefail',
      source: 'remote',
      on: 'updateFail',
      action(transform, e) {
        const remote = this.source;
        debugger
        // if (e instanceof NetworkError) {
        if (e.message.startsWith('Network error')) {
          console.log("The server never received the request");
        } else {
          console.log('The server rejected the request');
          return remote.requestQueue.skip();
        }
      }
    });
  }
};

