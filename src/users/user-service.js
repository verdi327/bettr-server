'use strict';

const bcrypt = require('bcryptjs');

const UserService = {
  validateUserFields(user) {
    const response = {};
    const validations = {
      full_name: this.validateFullName,
      email: this.validateEmail,
      password: this.validatePassword,
      sex: this.validateSex
    };

    for (const [field, validation] of Object.entries(validations)) {
      let result = validation(user[field]);
      if (result.error) {
        response[field] = result.error;
        response.error = true;
      }
    }

    return response;
  },

  validateFullName(full_name) {
    const response = {};
    if (full_name.length < 3) {
      response.error = 'full_name must be at least 3 characters';
    } else if (full_name.trim().indexOf(' ') === -1)
      response.error = 'full_name must contain a space between first and last name';
    return response;
  },

  validateEmail(email) {
    const response = {};
    if (!/\S+@\S+/.test(email)) {
      response.error = 'invalid email format';
    }
    return response;
  },

  validatePassword(password) {
    const response = {};
    if (password.length < 6) {
      response.error = 'password must be at least 6 characters';
    }
    return response;
  },

  validateSex(sex) {
    const response = {};
    if (!['male', 'female'].includes(sex)) {
      response.error = 'sex must be of either male or female';
    }
    return response;
  },

  insert(knex, user){
    return knex('users')
      .insert(user)
      .returning('*')
      .then(rows => rows[0]);
  },

  findById(knex, id) {
    return knex('users').where({id}).first('*');
  },

  findByEmail(knex, email) {
    return knex('users')
      .where({email})
      .first('*');
  },

  hashPassword(password) {
    return bcrypt.hash(password, 10);
  },

  serialize(user) {
    const {id, email, full_name, sex} = user;
    return {id, email, full_name, sex};
  }
};

module.exports = UserService;