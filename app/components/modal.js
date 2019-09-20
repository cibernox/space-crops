import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class extends Component {
  @action
  handleKeydown(e) {
    if (e.key === 'Escape') {
      this.args.onClose();
    }
  }
}
