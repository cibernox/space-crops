import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

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
  async showCares(crop) {
    this.cropCare = await this.store.query(q => q.findRelatedRecord(crop, 'cropCare'));
  }
}
