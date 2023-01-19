const fs = require('fs');

const getJWTSecret = () => {
    let JWTSecret;

    if (process.env.NODE_ENV === 'development') {
        JWTSecret = process.env.JWT_SECRET
     }
     else if(process.env.NODE_ENV === 'production') {
        JWTSecret = fs.readFileSync('/run/secrets/jwtsecret', 'utf-8');
        JWTSecret=JWTSecret.trim();
     }
  
     return JWTSecret
};

module.exports = getJWTSecret