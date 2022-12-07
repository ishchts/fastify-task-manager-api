import { Model } from 'objection';
import objectionUnique from 'objection-unique';
import sesure from '../lib/secure.js';

const unique = objectionUnique({
  fields: ['email'],
});

export default class User extends unique(Model) {
  static get tableName() {
    return 'users';
  }

  set password(value) {
    this.passwordDigested = sesure(value);
  }

  verifyPassword(value) {
    return this.passwordDigested === sesure(value);
  }
}
