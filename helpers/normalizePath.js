
const normalizePath = (url) => {
    try {
      const urlObj = new URL(url);
      console.log('URL:', urlObj);
      const path = urlObj.pathname;
  
      // Definir patrones para normalización
      const pathPatterns = [
        // Formato: [expresión regular para detectar, versión normalizada]
        [/^\/payments\/[^\/]+\/?$/, '/payments'],
        // [/^\/payments\/\(S\([^)]+\)\).*$/, '/payments'],
        [/^\/orders\/\d+$/, '/orders'],      // Normaliza /orders/12345 a /orders
        // [/^\/users\/[^\/]+\/profile$/, '/users/profile'],  // /users/nombre/profile a /users/profile
        // Puedes agregar más patrones según sea necesario
      ];
  
      // Busca coincidencia con algún patrón y normaliza
      for (const [pattern, normalized] of pathPatterns) {
        if (pattern.test(path)) {
          return normalized;
        }
      }
  
      // If none was matched return error ?
       
      return path || '/'; // Si no hay coincidencia, devuelve la ruta original
    } catch (error) {
      console.error('Error normalizando la URL:', error);
      return '/';
    }
  }

  module.exports = {
    normalizePath
  }