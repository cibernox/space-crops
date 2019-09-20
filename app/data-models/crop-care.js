import { Model, attr, belongsTo } from 'ember-orbit';

export default Model.extend({
  water: attr('number'),
  light: attr('number'),
  fertilizerType: attr('string'),
  fertilizerAmount: attr('number'),

  // Relationships
  crop: belongsTo('crop'),
});
