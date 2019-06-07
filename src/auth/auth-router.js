'use strict';

const express = require('express');
const bodyParser = express.json();
const authRouter = express.Router();
const {requireAuth} = require('../middleware/jwt-auth');
const AuthService = require('./auth-service');
const UserService = require('../users/user-service');
const CycleService = require('../cycles/cycle-service');

authRouter
  .route('/login')
  .post(bodyParser, async (req, res, next) => {
    const {email, password} = req.body;
    
    if (!email || !password) {
      return next({status: 400, message: 'email and password required'});
    }
    
    try {
      const user = await AuthService.findByEmail(req.app.get('db'), email);
      if (!user) {
        return next({status: 401, message: 'invalid email or password'});
      }
      
      const isMatch = await AuthService.comparePasswords(password, user.password);
      if (!isMatch) {
        return next({status: 401, message: 'invalid email or password'});
      }

      const sub = user.email;
      const payload = { user_id: user.id };
      const authToken = await AuthService.createJwt(sub, payload);
      

      res.json({authToken, user: UserService.serialize(user)});
    } catch(err) {
      next({status: 500, message: err.message});
    }
  });

authRouter
  .route('/current-user')
  .get(requireAuth, async (req, res, next) => {
    const user = UserService.serialize(req.user);
    try {
      const cycle = await CycleService.findCurrentByUserId(req.app.get('db'), user.id);
      user.hasCurrentCycle = cycle ? true : false;
      res.json(user);
    } catch(err) {
      next({status: 500, message: err.message});
    }
  });

module.exports = authRouter;

