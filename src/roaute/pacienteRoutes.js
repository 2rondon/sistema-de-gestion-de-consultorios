const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/pacienteController');

router.get('/', pacienteController.index);
router.get('/create', pacienteController.showCreate);
router.post('/', pacienteController.create);
router.get('/:id/edit', pacienteController.showEdit);
router.put('/:id', pacienteController.update);
router.delete('/:id', pacienteController.delete);
router.get('/search', pacienteController.search);

module.exports = router;