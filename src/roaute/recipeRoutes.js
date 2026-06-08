const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController'); // Debe coincidir EXACTAMENTE con el nombre del archivo

router.get('/', recipeController.index);
router.get('/create', recipeController.showCreate);
router.post('/', recipeController.create);
router.get('/:id', recipeController.show);
router.delete('/:id', recipeController.delete);

module.exports = router;