const Paciente = require('../models/Paciente');

exports.index = (req, res) => {
    Paciente.getAll((err, pacientes) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error al cargar pacientes');
        }
        res.render('pacientes/index', { 
            title: 'Pacientes', 
            pacientes: pacientes || [] 
        });
    });
};

exports.showCreate = (req, res) => {
    // Pasar un objeto paciente vacío para la vista
    res.render('pacientes/create', { 
        title: 'Nuevo Paciente',
        paciente: null  // ← Importante: pasar paciente como null
    });
};

exports.create = (req, res) => {
    Paciente.create(req.body, (err, id) => {
        if (err) {
            console.error(err);
            return res.render('pacientes/create', { 
                title: 'Nuevo Paciente',
                error: 'Error al crear paciente. Verifique que la cédula no esté duplicada.',
                paciente: req.body  // ← Pasar los datos del formulario
            });
        }
        res.redirect('/pacientes');
    });
};

exports.showEdit = (req, res) => {
    Paciente.getById(req.params.id, (err, paciente) => {
        if (err || !paciente) {
            return res.status(404).send('Paciente no encontrado');
        }
        res.render('pacientes/edit', { 
            title: 'Editar Paciente', 
            paciente: paciente  // ← Pasar el paciente encontrado
        });
    });
};

exports.update = (req, res) => {
    Paciente.update(req.params.id, req.body, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error al actualizar paciente');
        }
        res.redirect('/pacientes');
    });
};

exports.delete = (req, res) => {
    Paciente.delete(req.params.id, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error al eliminar paciente');
        }
        res.redirect('/pacientes');
    });
};

exports.search = (req, res) => {
    const { term } = req.query;
    Paciente.search(term, (err, pacientes) => {
        if (err) {
            return res.status(500).json({ error: 'Error en la búsqueda' });
        }
        res.json(pacientes);
    });
};