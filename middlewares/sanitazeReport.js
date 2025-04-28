function cleanString(str) {
    // Elimina caracteres potencialmente peligrosos
    return str.replace(/[\n\r\t"'`<>]/g, ' ');
  }

function sanitazeReport(req, res, next) {
    try {
      
      req.originalReport = structuredClone(req.body['csp-report']);
      const informe = req.body['csp-report'];

      // Obtener la IP del cliente
      const clientIp = req.headers['x-forwarded-for'] || req.ip;
      req.clientIp = clientIp; // Guardar la IP en el objeto de la solicitud

      const userAgent = req.headers['user-agent'];
      req.userAgent = userAgent;
      
      // Sanitizar datos sensibles
      if (informe['source-file']) {
        try {
          const urlArchivo = new URL(informe['source-file']);
          urlArchivo.search = '';
          informe['source-file'] = urlArchivo.toString();
        } catch (e) {
          // Si no es una URL válida, eliminar el campo
          delete informe['source-file'];
        }
      }
      
      // Eliminar propiedades no esperadas 
      const camposPermitidos = [
        'document-uri', 'referrer', 'blocked-uri', 
        'violated-directive', 'effective-directive', 'original-policy',
        'source-file', 'line-number', 'column-number', 'status-code','disposition', 'script-sample'
      ];
      
      Object.keys(informe).forEach(key => {
        if (!camposPermitidos.includes(key)) {
          delete informe[key];
        } else {
          // Sanitizar strings para prevenir inyección
          if (typeof informe[key] === 'string') {
            informe[key] = cleanString(informe[key]);
          }
        }
      });
      
      req.body['csp-report'] = informe;
      
      next();
    } catch (error) {
      console.error('Error al validar informe:', error);
      return res.status(400).send({ error: 'Error al procesar informe' });
    }
  }

  module.exports = {
    sanitazeReport
  }