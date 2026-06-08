const express = require('express');
const router = express.Router();
const citaController = require('../controllers/citaController');

router.get('/', citaController.index);
router.get('/create', citaController.showCreate);
router.post('/', citaController.create);
router.get('/:id/edit', citaController.showEdit);
router.put('/:id', citaController.update);
router.delete('/:id', citaController.delete);
router.patch('/:id/status', citaController.updateStatus);

module.exports = router;