const db = require('../database/db');

exports.index = (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    const currentYear = new Date().getFullYear().toString();
    
    let stats = {
        total_pacientes: 0,
        total_citas: 0,
        citas_completadas: 0,
        citas_pendientes: 0,
        citas_hoy: 0
    };
    let topPacientes = [];
    
    db.get('SELECT COUNT(*) as count FROM pacientes', [], (err, result) => {
        if (!err && result) stats.total_pacientes = result.count;
        
        db.get('SELECT COUNT(*) as count FROM citas', [], (err, result) => {
            if (!err && result) stats.total_citas = result.count;
            
            db.get("SELECT COUNT(*) as count FROM citas WHERE estado = 'completada'", [], (err, result) => {
                if (!err && result) stats.citas_completadas = result.count;
                
                db.get("SELECT COUNT(*) as count FROM citas WHERE estado = 'pendiente'", [], (err, result) => {
                    if (!err && result) stats.citas_pendientes = result.count;
                    
                    db.all(`SELECT p.nombre, p.apellido, COUNT(c.id) as total_citas 
                            FROM pacientes p 
                            LEFT JOIN citas c ON p.id = c.paciente_id 
                            GROUP BY p.id 
                            ORDER BY total_citas DESC 
                            LIMIT 10`, [], (err, result) => {
                        if (!err && result) topPacientes = result;
                        
                        res.render('reportes/index', {
                            title: 'Reportes y Estadísticas',
                            stats: stats,
                            topPacientes: topPacientes
                        });
                    });
                });
            });
        });
    });
};

// Función para generar PDF de pacientes - Versión corregida
exports.pacientesPDF = (req, res) => {
    console.log('Generando PDF de pacientes...');
    
    // Obtener todos los pacientes con sus estadísticas completas
    const query = `
        SELECT 
            p.id,
            p.nombre,
            p.apellido,
            p.cedula,
            p.telefono,
            p.email,
            COUNT(DISTINCT c.id) as total_citas,
            SUM(CASE WHEN c.estado = 'completada' THEN 1 ELSE 0 END) as citas_completadas,
            SUM(CASE WHEN c.estado = 'pendiente' THEN 1 ELSE 0 END) as citas_pendientes,
            SUM(CASE WHEN c.estado = 'confirmada' THEN 1 ELSE 0 END) as citas_confirmadas,
            SUM(CASE WHEN c.estado = 'cancelada' THEN 1 ELSE 0 END) as citas_canceladas,
            COUNT(DISTINCT r.id) as total_recetas
        FROM pacientes p
        LEFT JOIN citas c ON p.id = c.paciente_id
        LEFT JOIN recipes r ON p.id = r.paciente_id
        GROUP BY p.id
        ORDER BY total_citas DESC
    `;
    
    db.all(query, [], (err, pacientes) => {
        if (err) {
            console.error('Error en consulta de pacientes:', err);
            return res.status(500).send('Error al generar reporte: ' + err.message);
        }
        
        // Estadísticas generales
        db.get('SELECT COUNT(*) as total FROM pacientes', [], (err, totalPacientes) => {
            db.get('SELECT COUNT(*) as total FROM citas', [], (err, totalCitas) => {
                db.get("SELECT COUNT(*) as total FROM citas WHERE estado = 'completada'", [], (err, totalCompletadas) => {
                    db.get("SELECT COUNT(*) as total FROM citas WHERE estado = 'pendiente'", [], (err, totalPendientes) => {
                        db.get("SELECT COUNT(*) as total FROM citas WHERE estado = 'confirmada'", [], (err, totalConfirmadas) => {
                            db.get("SELECT COUNT(*) as total FROM citas WHERE estado = 'cancelada'", [], (err, totalCanceladas) => {
                                db.get('SELECT COUNT(*) as total FROM recipes', [], (err, totalRecetas) => {
                                    
                                    const stats = {
                                        total_pacientes: totalPacientes?.total || 0,
                                        total_citas: totalCitas?.total || 0,
                                        citas_completadas: totalCompletadas?.total || 0,
                                        citas_pendientes: totalPendientes?.total || 0,
                                        citas_confirmadas: totalConfirmadas?.total || 0,
                                        citas_canceladas: totalCanceladas?.total || 0,
                                        total_recetas: totalRecetas?.total || 0
                                    };
                                    
                                    // Renderizar la vista del PDF
                                    res.render('reportes/pacientes-pdf', {
                                        title: 'Reporte de Pacientes',
                                        pacientes: pacientes || [],
                                        stats: stats,
                                        fecha: new Date().toLocaleString()
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
};

// Función para generar PDF simple (si la necesitas)
exports.generatePDF = (req, res) => {
    res.send('PDF generado');
};