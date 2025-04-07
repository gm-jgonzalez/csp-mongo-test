

const secretKey = process.env.SECRET_KEY || "";
const jwt = require('jsonwebtoken');

// Funcion para crear un jwt en base a un payload, en este caso es solo el id
const generateJWT = (payload) => {
    const jwtPayload = {
        id: payload.id,
        origin: payload.origin,
    } 
  const token = jwt.sign({ jwtPayload }, secretKey, { expiresIn: "30m" });

  return token;
};

exports.generateJWT = generateJWT;