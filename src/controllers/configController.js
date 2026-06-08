const Configuracion = require('../models/Configuracion');

exports.index = (req, res) => {
    Configuracion.get((err, config) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error al cargar configuración');
        }
        res.render('configuracion/index', { title: 'Configuración', config: config || {} });
    });
};

exports.update = (req, res) => {
    Configuracion.update(req.body, (err) => {
        if (err) {
            console.error(err);
            return res.render('configuracion/index', { 
                title: 'Configuración',
                error: 'Error al actualizar configuración',
                config: req.body
            });
        }
        res.redirect('/configuracion?success=true');
    });
};