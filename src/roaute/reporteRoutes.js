const express = require('express');
const router = express.Router();
const reporteController = require('../controllers/reporteController');

// Verificar que las funciones existen
console.log('Controlador cargado:', Object.keys(reporteController));

router.get('/', reporteController.index);
router.get('/pdf', reporteController.generatePDF);
router.get('/pacientes-pdf', reporteController.pacientesPDF);  // Asegúrate que esta línea existe

module.exports = router;