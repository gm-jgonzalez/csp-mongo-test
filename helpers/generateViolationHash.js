const crypto = require('crypto');


const generateViolationHash = ({clientId,pageId, domain, path, violatedDirective, blockedUri}) => {
    const dataToHash = `${clientId}|${pageId}|${domain}|${path}|${violatedDirective}|${blockedUri}`;
    return crypto.createHash('sha256').update(dataToHash).digest('hex');
  }

module.exports = {
    generateViolationHash
}