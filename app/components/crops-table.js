import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class extends Component {
  @service store

  @action
  updateAttr(crop, attrName, value) {
    this.store.update(t => t.replaceAttribute(crop.identity, attrName, value));
  }
}
