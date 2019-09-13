import { RequestStrategy } from '@orbit/coordinator';

export default {
  create() {
    // Pull query results from the server
    return new RequestStrategy({
      name: 'store-remote-query',

      source: 'store',
      on: 'beforeQuery',
      target: 'remote',
      action: 'pull',
      blocking: true
    });
  }
};
