const db = require('../database/db');

class Paciente {
    static getAll(callback) {
        db.all('SELECT * FROM pacientes ORDER BY created_at DESC', callback);
    }

    static getById(id, callback) {
        db.get('SELECT * FROM pacientes WHERE id = ?', [id], callback);
    }

    static create(pacienteData, callback) {
        const { nombre, apellido, cedula, fecha_nacimiento, telefono, email, direccion } = pacienteData;
        
        db.run(`INSERT INTO pacientes (nombre, apellido, cedula, fecha_nacimiento, telefono, email, direccion) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [nombre, apellido, cedula, fecha_nacimiento, telefono, email, direccion],
            function(err) {
                callback(err, this?.lastID);
            }
        );
    }

    static update(id, pacienteData, callback) {
        const { nombre, apellido, cedula, fecha_nacimiento, telefono, email, direccion } = pacienteData;
        
        db.run(`UPDATE pacientes SET nombre = ?, apellido = ?, cedula = ?, 
                fecha_nacimiento = ?, telefono = ?, email = ?, direccion = ?, 
                updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
            [nombre, apellido, cedula, fecha_nacimiento, telefono, email, direccion, id],
            callback
        );
    }

    static delete(id, callback) {
        db.run('DELETE FROM pacientes WHERE id = ?', [id], callback);
    }

    static search(term, callback) {
        db.all(`SELECT * FROM pacientes WHERE nombre LIKE ? OR apellido LIKE ? OR cedula LIKE ?`,
            [`%${term}%`, `%${term}%`, `%${term}%`], callback);
    }
}

module.exports = Paciente;