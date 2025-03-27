

const { request, response } = require('express');
const jwt = require('jsonwebtoken');

const secretKey = process.env.SECRET_KEY


const validateJwt = (req = request, res = response, next) => {
    const token = req.params.token
   

    if (!token) {
        return res.status(403).json({
          status: 'error',
          msg: 'Incorrect token',
        });
      }

      try {
        const {jwtPayload} = jwt.verify(token, secretKey);

        const origin = jwtPayload.origin;
        const requestOrigin = req.headers.origin;
        console.log({
            jwtPayload,
            origin, 
            requestOrigin
        })
        if ( origin !== requestOrigin) return res.status(401).json({
            status: 'error',
            msg: 'Unauthorized',
        })
        //! find client in db by jwtPayload.id

        req.client = jwtPayload;

        next();
      } catch (error) {
        if (error.message === 'jwt expired') {
          return res.status(405).json({
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