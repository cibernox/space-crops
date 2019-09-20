import { Model, attr, hasOne } from 'ember-orbit';

export default Model.extend({
  cropType: attr('string'),
  name: attr('string'),
  avgHeight: attr('number'),
  health: attr('string'),
  foodProduction: attr('number'),

  // Relationships
  cropCare: hasOne('cropCare')
});