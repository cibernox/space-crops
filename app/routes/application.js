import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class extends Route {
  @service dataCoordinator

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
  }
}
