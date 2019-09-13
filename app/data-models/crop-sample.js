import { Model, attr, belongsTo } from 'ember-orbit';

export default Model.extend({
  cropType: attr('string'),
  name: attr('string'),
  avgHeight: attr('number'),
  health: attr('string'),
  foodProduction: attr('number'),

  // Relationships
  careInstructions: belongsTo('careInstructions'),
});
