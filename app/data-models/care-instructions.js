import { Model, attr } from 'ember-orbit';

export default Model.extend({
  watering: attr('number'),
  light: attr('number'),
  fertilizerType: attr('string'),
  fertilizerAmount: attr('number'),

  // Relationships
  // cropSample: belongsTo('crop'),
});
