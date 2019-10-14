import { RequestStrategy } from '@orbit/coordinator';

export default {
  create() {
    return new RequestStrategy({
      name: 'remote-updatefail',
      source: 'remote',
      on: 'updateFail',
      action(transform, e) {
        if (e.response) {
          console.log('The server responded with an error');
        } else {
          console.log('The request did not respond at all');
          return this.source.requestQueue.skip();
        }
      },
      passHints: true,
      blocking: true
    });
  }
};

