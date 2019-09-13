import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class extends Component {
  @tracked isActive = false

  @action
  toggleState() {
    this.isActive = !this.isActive;
  }

  focus(el) {
    el.focus();
  }
}
