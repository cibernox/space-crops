import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
// import { getOwner } from '@ember/application';

export default class extends Route {
  @service dataCoordinator
  @service network

  async beforeModel() {
    await this._bootOrbit();
  }

  async _bootOrbit() {
    // If a backup source is present, populate the store from backup prior to activating the coordinator
    const backup = this.dataCoordinator.getSource("backup");
    if (backup) {
      const transform = await backup.pull(q => q.findRecords());
      await this.store.sync(transform);
    }

    await this.dataCoordinator.activate();
    // this._retryWhenBackOnline();
  }

  _retryWhenBackOnline() {
    this.network.onChange(onLine => {
      if (onLine) {
        let remote = getOwner(this).lookup('data-source:remote');
        remote.requestQueue.retry();
      }
    });
  }
}
