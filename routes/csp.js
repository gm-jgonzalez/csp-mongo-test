const {Router} = require('express');
const {getCsp, cspReports,generateToken} = require('../controllers/csp');
const {limitCSP} = require('../middlewares/rateLimit');
const {validateJwt} = require('../middlewares/validateParamJwt');
const { sanitazeReport } = require('../middlewares/sanitazeReport');
const { processURL } = require('../middlewares/domainAndPath');

const router = Router();



router.get('/', getCsp)

router.post('/report/:token', [limitCSP,validateJwt,sanitazeReport,processURL], cspReports)
router.post('/generate-token', [limitCSP], generateToken)

module.exports = router;