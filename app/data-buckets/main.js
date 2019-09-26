import BucketClass from '@orbit/indexeddb-bucket';

export default {
  create(injections = {}) {
    injections.name = 'main';
    injections.namespace =
      'emberfest-deck-main';
    return new BucketClass(injections);
  }
};
