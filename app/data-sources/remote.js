import SourceClass from '@orbit/jsonapi';

export default {
  create(injections = {}) {
    injections.name = 'remote';
    injections.defaultFetchSettings = { timeout: 10000 }
    return new SourceClass(injections);
  }
};
