const {Router} = require('express');
const {getCsp, cspReports,generateToken} = require('../controllers/csp');
const {limitCSP} = require('../middlewares/rateLimit');
const {validateJwt} = require('../middlewares/validateParamJwt');

const router = Router();



router.get('/', getCsp)

router.post('/report/:token', [limitCSP,validateJwt], cspReports)
router.post('/generate-token', [limitCSP], generateToken)

module.exports = router;