import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class extends Component {
  @tracked isActive = false

  @action
  toggleState() {
    this.isActive = !this.isActive;
  }

  @action
  handleKeydown(e) {
    if (e.keyCode === 13) {
      this.args.onChange(e.target.value);
      this.toggleState();
    } else if (e.keyCode === 27) {
      this.toggleState();
    }
  }

  focus(el) {
    el.focus();
  }
}
