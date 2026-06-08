const db = require('../database/db');

class Recipe {
    static getAll(callback) {
        db.all(`SELECT r.*, p.nombre, p.apellido, p.cedula 
                FROM recipes r 
                JOIN pacientes p ON r.paciente_id = p.id 
                ORDER BY r.fecha DESC`, callback);
    }

    static getById(id, callback) {
        db.get(`SELECT r.*, p.nombre, p.apellido, p.cedula, p.fecha_nacimiento
                FROM recipes r 
                JOIN pacientes p ON r.paciente_id = p.id 
                WHERE r.id = ?`, [id], callback);
    }

    static getByPaciente(paciente_id, callback) {
        db.all(`SELECT * FROM recipes WHERE paciente_id = ? ORDER BY fecha DESC`, 
            [paciente_id], callback);
    }

    static create(recipeData, callback) {
        const { paciente_id, diagnostico, medicamentos, indicaciones } = recipeData;
        
        db.run(`INSERT INTO recipes (paciente_id, diagnostico, medicamentos, indicaciones) 
                VALUES (?, ?, ?, ?)`,
            [paciente_id, diagnostico, medicamentos, indicaciones],
            function(err) {
                callback(err, this?.lastID);
            }
        );
    }

    static delete(id, callback) {
        db.run('DELETE FROM recipes WHERE id = ?', [id], callback);
    }
}

module.exports = Recipe;