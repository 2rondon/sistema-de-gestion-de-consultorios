const express = require('express');
const router = express.Router();
const configController = require('../controllers/configController');

router.get('/', configController.index);
router.put('/', configController.update);

module.exports = router;