import { RequestStrategy } from '@orbit/coordinator';

export default {
  create() {
    return new RequestStrategy({
      name: 'remote-queryfail',

      /**
       * The name of the source to be observed.
       */
      source: 'remote',

      /**
       * The name of the event to observe (e.g. `beforeQuery`, `query`,
       * `beforeUpdate`, `update`, etc.).
       */
      on: 'queryFail',

      /**
       * The action to perform on the target.
       *
       * Can be specified as a string (e.g. `pull`) or a function which will be
       * invoked in the context of this strategy (and thus will have access to
       * both `this.source` and `this.target`).
       */
      action() {
        this.source.requestQueue.skip();
      }
    });
  }
};

