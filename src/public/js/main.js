// Cargar gráficos del dashboard
if (document.getElementById('citasChart')) {
    const ctx = document.getElementById('citasChart').getContext('2d');
    const estados = JSON.parse(document.getElementById('estadosData').textContent);
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: estados.map(e => e.estado),
            datasets: [{
                label: 'Citas por Estado',
                data: estados.map(e => e.count),
                backgroundColor: ['#667eea', '#84fab0', '#fccb90', '#ff6b6b'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1 }
                }
            }
        }
    });
}

// Cargar gráfico de citas por mes
if (document.getElementById('citasPorMesChart')) {
    const ctx = document.getElementById('citasPorMesChart').getContext('2d');
    const citasPorMes = JSON.parse(document.getElementById('citasPorMesData').textContent);
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            datasets: [{
                label: 'Citas por Mes',
                data: citasPorMes,
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top' }
            }
        }
    });
}

// Auto-cerrar alertas
setTimeout(() => {
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        const bsAlert = new bootstrap.Alert(alert);
        setTimeout(() => bsAlert.close(), 3000);
    });
}, 1000);

// Confirmar eliminación
document.querySelectorAll('.delete-confirm').forEach(button => {
    button.addEventListener('click', (e) => {
        if (!confirm('¿Está seguro de que desea eliminar este registro?')) {
            e.preventDefault();
        }
    });
});
