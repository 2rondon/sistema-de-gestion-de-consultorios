const db = require('../database/db');

class Cita {
    static getAll(callback) {
        db.all(`SELECT c.*, p.nombre, p.apellido, p.cedula 
                FROM citas c 
                JOIN pacientes p ON c.paciente_id = p.id 
                ORDER BY c.fecha DESC, c.hora DESC`, callback);
    }

    static getById(id, callback) {
        db.get(`SELECT c.*, p.nombre, p.apellido, p.cedula 
                FROM citas c 
                JOIN pacientes p ON c.paciente_id = p.id 
                WHERE c.id = ?`, [id], callback);
    }

    static create(citaData, callback) {
        const { paciente_id, fecha, hora, motivo, estado } = citaData;
        
        db.run(`INSERT INTO citas (paciente_id, fecha, hora, motivo, estado) 
                VALUES (?, ?, ?, ?, ?)`,
            [paciente_id, fecha, hora, motivo, estado || 'pendiente'],
            function(err) {
                callback(err, this?.lastID);
            }
        );
    }

    static update(id, citaData, callback) {
        const { fecha, hora, motivo, estado } = citaData;
        
        db.run(`UPDATE citas SET fecha = ?, hora = ?, motivo = ?, estado = ? WHERE id = ?`,
            [fecha, hora, motivo, estado, id],
            callback
        );
    }

    static updateStatus(id, estado, callback) {
        db.run('UPDATE citas SET estado = ? WHERE id = ?', [estado, id], callback);
    }

    static delete(id, callback) {
        db.run('DELETE FROM citas WHERE id = ?', [id], callback);
    }

    static getByDateRange(startDate, endDate, callback) {
        db.all(`SELECT c.*, p.nombre, p.apellido 
                FROM citas c 
                JOIN pacientes p ON c.paciente_id = p.id 
                WHERE c.fecha BETWEEN ? AND ? 
                ORDER BY c.fecha, c.hora`, [startDate, endDate], callback);
    }

    static getStats(callback) {
        db.get(`SELECT 
                    COUNT(*) as total,
                    SUM(CASE WHEN estado = 'pendiente' THEN 1 ELSE 0 END) as pendientes,
                    SUM(CASE WHEN estado = 'confirmada' THEN 1 ELSE 0 END) as confirmadas,
                    SUM(CASE WHEN estado = 'completada' THEN 1 ELSE 0 END) as completadas,
                    SUM(CASE WHEN estado = 'cancelada' THEN 1 ELSE 0 END) as canceladas
                FROM citas`, callback);
    }
}

module.exports = Cita;
