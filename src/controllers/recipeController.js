const Recipe = require('../models/Recipe');
const Paciente = require('../models/Paciente');

exports.index = (req, res) => {
    Recipe.getAll((err, recipes) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error al cargar recetas');
        }
        res.render('recipes/index', { 
            title: 'Recetas Médicas', 
            recipes: recipes || [] 
        });
    });
};

exports.showCreate = (req, res) => {
    Paciente.getAll((err, pacientes) => {
        if (err) {
            return res.status(500).send('Error al cargar pacientes');
        }
        res.render('recipes/create', { 
            title: 'Nueva Receta', 
            pacientes: pacientes || [],
            recipe: null  // ← Importante: pasar recipe como null
        });
    });
};

exports.create = (req, res) => {
    Recipe.create(req.body, (err, id) => {
        if (err) {
            console.error(err);
            Paciente.getAll((err, pacientes) => {
                res.render('recipes/create', { 
                    title: 'Nueva Receta',
                    error: 'Error al crear receta',
                    pacientes: pacientes || [],
                    recipe: req.body  // ← Pasar los datos del formulario
                });
            });
        } else {
            res.redirect('/recipes');
        }
    });
};

exports.show = (req, res) => {
    Recipe.getById(req.params.id, (err, recipe) => {
        if (err || !recipe) {
            return res.status(404).send('Receta no encontrada');
        }
        res.render('recipes/show', { 
            title: 'Detalle de Receta', 
            recipe: recipe 
        });
    });
};

exports.delete = (req, res) => {
    Recipe.delete(req.params.id, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error al eliminar receta');
        }
        res.redirect('/recipes');
    });
};