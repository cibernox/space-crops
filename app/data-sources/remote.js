import JSONAPISource from '@orbit/jsonapi';

export default {
  create(injections = {}) {
    injections.name = 'remote';
    return new JSONAPISource(injections);
  }
};
