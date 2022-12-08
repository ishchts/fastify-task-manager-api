import { Model } from 'objection';
import objectionUnique from 'objection-unique';

const unique = objectionUnique({
  fields: ['name'],
});

export default class Status extends unique(Model) {
  static get tableName() {
    return 'statuses';
  }
}
