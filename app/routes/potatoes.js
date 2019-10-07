import Route from '@ember/routing/route';

export default class extends Route {
  async model() {
    return this.store.liveQuery(q => {
      return q.findRecords('crop')
        .filter({ attribute: 'cropType', value: 'potatoes' })
        .sort('name');
    }, { sources: { remote: { timeout: 10000 } } });
  }
}
