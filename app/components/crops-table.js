import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { capitalize } from '@ember/string';
// import { buildQuery } from '@orbit/data';

export default class extends Component {
  @service store
  @tracked cropCare = undefined
  healthValues = [
    'Very bad',
    'Bad',
    'Poor',
    'Average',
    'Good',
    'Great',
    'Outstanding'
  ]

  @action
  updateAttr(crop, attrName, value) {
    this.store.update(t => t.replaceAttribute(crop.identity, attrName, value));
  }

  @action
  async createCrop() {
    this.store.addRecord({
      type: 'crop',
      cropType: this.args.cropType,
      name: `${capitalize(this.args.cropType)} ${this.args.crops.length + 1}`,
      cares: {
        water: null,
        fertilizerType: null,
        fertilizerAmount: null,
        light: null
      }
    });
  }

  @action
  async removeCrop(crop) {
    this.store.removeRecord(crop);
  }

  @action
  async showCares({ cares }) {
    this.cropCare = cares
  }
}
