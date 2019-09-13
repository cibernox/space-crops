import Route from '@ember/routing/route';

export default class extends Route {
  async model() {
    // return this.store.liveQuery(q => {
    //   return q.findRecords('crop-sample')
    //     .filter({ attribute: 'cropType', value: 'potatoes' })
    //     .sort('name');
    // });
  }
}
