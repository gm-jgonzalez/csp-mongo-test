const {Router} = require('express');
const { newMonitorPage } = require('../controllers/monitorPage');


const router = Router();





router.post('', newMonitorPage)


module.exports = router;