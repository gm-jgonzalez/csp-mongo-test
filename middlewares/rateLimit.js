const rateLimit = require('express-rate-limit');


// Limitador de tasa basado en IP
const limitCSP = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // máximo 100 solicitudes por IP
    standardHeaders: true,
    message: { error: 'Demasiadas solicitudes, intente más tarde' }
  });


module.exports = {limitCSP}