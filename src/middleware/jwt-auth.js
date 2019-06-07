'use strict';
const AuthService = require('../auth/auth-service');

const requireAuth = async (req, res, next) => {
  const authToken = req.get('Authorization') || '';
  let token;

  if (!authToken.toLowerCase().startsWith('bearer ')) {
    return next({status: 401, message: 'Missing bearer token'});
  } 
    
  token = authToken.slice('bearer '.length, authToken.length);

  try {
    const payload = await AuthService.verifyJwt(token);
    const user = await AuthService.findByEmail(req.app.get('db'), payload.sub);
    
    if (!user) {
      return next({status: 401, message: 'Unauthorized request'});
    }

    req.user = user;
    next();
  } catch(err) {
    return next({status: 401, message: 'Unauthorized request'});
  }
};

module.exports = {
  requireAuth
};