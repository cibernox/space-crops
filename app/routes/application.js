import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class extends Route {
  @service dataCoordinator

  async beforeModel() {
    await this._bootOrbit();
    // return this.store.liveQuery(q => {
    //   return q.findRecords('crop-sample')
    //     .filter({ attribute: 'cropType', value: 'potatoes' })
    //     .sort('name');
    // });
  }

  async _bootOrbit() {
    let coordinator = this.dataCoordinator;
    // let remote = coordinator.getSource('remote');
    return coordinator.activate();
  }
}
