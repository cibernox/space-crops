import { RequestStrategy } from '@orbit/coordinator';

export default {
  create() {
    return new RequestStrategy({
      name: 'remote-queryfail',
      source: 'remote',
      on: 'queryFail',
      action() {
        this.source.requestQueue.skip()
      },
      blocking: true
    });
  }
};

