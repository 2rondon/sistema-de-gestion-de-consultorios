const Cita = require('../models/Cita');
const Paciente = require('../models/Paciente');

exports.index = (req, res) => {
    Cita.getAll((err, citas) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error al cargar citas');
        }
        res.render('citas/index', { 
            title: 'Citas', 
            citas: citas || [] 
        });
    });
};

exports.showCreate = (req, res) => {
    Paciente.getAll((err, pacientes) => {
        if (err) {
            return res.status(500).send('Error al cargar pacientes');
        }
        res.render('citas/create', { 
            title: 'Nueva Cita', 
            pacientes: pacientes || [],
            cita: null  // ← Importante: pasar cita como null
        });
    });
};

exports.create = (req, res) => {
    Cita.create(req.body, (err, id) => {
        if (err) {
            console.error(err);
            Paciente.getAll((err, pacientes) => {
                res.render('citas/create', { 
                    title: 'Nueva Cita',
                    error: 'Error al crear cita',
                    pacientes: pacientes || [],
                    cita: req.body  // ← Pasar los datos del formulario
                });
            });
        } else {
            res.redirect('/citas');
        }
    });
};

exports.showEdit = (req, res) => {
    Cita.getById(req.params.id, (err, cita) => {
        if (err || !cita) {
            return res.status(404).send('Cita no encontrada');
        }
        Paciente.getAll((err, pacientes) => {
            res.render('citas/edit', { 
                title: 'Editar Cita', 
                cita: cita,
                pacientes: pacientes || []
            });
        });
    });
};

exports.update = (req, res) => {
    Cita.update(req.params.id, req.body, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error al actualizar cita');
        }
        res.redirect('/citas');
    });
};

exports.delete = (req, res) => {
    Cita.delete(req.params.id, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error al eliminar cita');
        }
        res.redirect('/citas');
    });
};

exports.updateStatus = (req, res) => {
    const { estado } = req.body;
    Cita.updateStatus(req.params.id, estado, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al actualizar estado' });
        }
        res.json({ success: true });
    });
};
