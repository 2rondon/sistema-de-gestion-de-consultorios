const db = require('../database/db');

exports.index = (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    
    // Consultas básicas
    const queries = {
        pacientesHoy: 'SELECT COUNT(*) as total FROM citas WHERE fecha = ?',
        pacientesMes: `SELECT COUNT(*) as total FROM citas WHERE strftime('%m', fecha) = ? AND strftime('%Y', fecha) = ?`,
        pacientesAnio: `SELECT COUNT(*) as total FROM citas WHERE strftime('%Y', fecha) = ?`,
        totalPacientes: 'SELECT COUNT(*) as total FROM pacientes',
        citasEstado: `SELECT estado, COUNT(*) as total FROM citas GROUP BY estado`,
        citasPorMes: `SELECT strftime('%m', fecha) as mes, COUNT(*) as total FROM citas WHERE strftime('%Y', fecha) = ? GROUP BY strftime('%m', fecha)`,
        topPacientes: `SELECT p.nombre, p.apellido, COUNT(c.id) as total_citas 
                       FROM pacientes p 
                       LEFT JOIN citas c ON p.id = c.paciente_id 
                       GROUP BY p.id 
                       ORDER BY total_citas DESC 
                       LIMIT 5`,
        citasRecientes: `SELECT c.*, p.nombre, p.apellido 
                         FROM citas c 
                         JOIN pacientes p ON c.paciente_id = p.id 
                         WHERE c.fecha >= date('now')
                         ORDER BY c.fecha ASC 
                         LIMIT 10`
    };
    
    // Ejecutar todas las consultas en paralelo
    Promise.all([
        new Promise((resolve) => db.get(queries.pacientesHoy, [today], (err, r) => resolve(r?.total || 0))),
        new Promise((resolve) => db.get(queries.pacientesMes, [currentMonth.toString().padStart(2,'0'), currentYear.toString()], (err, r) => resolve(r?.total || 0))),
        new Promise((resolve) => db.get(queries.pacientesAnio, [currentYear.toString()], (err, r) => resolve(r?.total || 0))),
        new Promise((resolve) => db.get(queries.totalPacientes, [], (err, r) => resolve(r?.total || 0))),
        new Promise((resolve) => db.all(queries.citasEstado, [], (err, r) => resolve(r || []))),
        new Promise((resolve) => db.all(queries.citasPorMes, [currentYear.toString()], (err, r) => resolve(r || []))),
        new Promise((resolve) => db.all(queries.topPacientes, [], (err, r) => resolve(r || []))),
        new Promise((resolve) => db.all(queries.citasRecientes, [], (err, r) => resolve(r || [])))
    ]).then(([
        pacientesHoyVal, pacientesMesVal, pacientesAnioVal, totalPacientesVal,
        citasEstado, citasPorMes, topPacientes, citasRecientes
    ]) => {
        // Procesar datos para gráfico de citas por mes
        const citasPorMesData = Array(12).fill(0);
        citasPorMes.forEach(item => {
            const mesIndex = parseInt(item.mes) - 1;
            if (mesIndex >= 0 && mesIndex < 12) {
                citasPorMesData[mesIndex] = item.total;
            }
        });
        
        // Calcular tasa de éxito
        let totalCitas = 0;
        let citasCompletadas = 0;
        citasEstado.forEach(e => {
            totalCitas += e.total;
            if (e.estado === 'completada') citasCompletadas = e.total;
        });
        const tasaExitoVal = totalCitas > 0 ? Math.round((citasCompletadas / totalCitas) * 100) : 0;
        
        // CORRECCIÓN CRÍTICA: Construir el objeto stats con las variables de la Base de Datos
        const stats = {
            pacientesDiarios: pacientesHoyVal,
            pacientesMensuales: pacientesMesVal,
            pacientesAnuales: pacientesAnioVal,
            pacientesTotales: totalPacientesVal,
            citasPorEstado: citasEstado,
            citasPorMesData: citasPorMesData,
            topPacientes: topPacientes,
            tasaExito: tasaExitoVal,
            citasRecientes: citasRecientes
        };
        
        // Renderizar dashboard enviando los objetos reales procesados
        res.render('dashboard/index', {
             title: 'Dashboard',
             stats: stats
        });
    }).catch(err => {
        console.error('Error en dashboard:', err);
        // Renderizar con datos vacíos en caso de fallo real de BD
        res.render('dashboard/index', {
            title: 'Dashboard',
            stats: {
                pacientesDiarios: 0,
                pacientesMensuales: 0,
                pacientesAnuales: 0,
                pacientesTotales: 0,
                citasPorEstado: [],
                citasPorMesData: Array(12).fill(0),
                topPacientes: [],
                tasaExito: 0,
                citasRecientes: []
            }
        });
    });
};