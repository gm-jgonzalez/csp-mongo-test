

const { request, response } = require('express');
const jwt = require('jsonwebtoken');

const secretKey = process.env.SECRET_KEY


const validateJwt = (req = request, res = response, next) => {
    // console.log({req})
    const token = req.params.token
    console.log({body: req.body, token})
    
    if (!token) {
        return res.status(403).json({
          status: 'error',
          msg: 'Incorrect token',
        });
      }

      try {
        const {jwtPayload} = jwt.verify(token, secretKey);
       
        const domain = jwtPayload.origin;
        const requestOrigin = req.headers.origin;
        
        //! find client in db by jwtPayload.id

        req.clientId = jwtPayload.id;
        req.jwtDomain = domain;
        
  
        next();
      } catch (error) {
        console.log({error})
        if (error.message === 'jwt expired') {
          return res.status(410).json({
            status: 'error',
            msg: 'Token expired',
          });
        }
        return res.status(401).json({
            status: 'error',
            msg: 'Unauthorized',
        });
      }
}

module.exports = {
    validateJwt
}