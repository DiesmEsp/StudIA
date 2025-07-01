const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('../../back/app.db', (err) => {
    if(err){
        console.error('Error al conectar a la base de datos', err.message);
        return;
    }
    console.log('Conexión exitosa con la base de datos Sqlite');
});
module.exports = db;

function getEstadisticas(callback){
    const stats = {};

    // Query para top 3 cursos más comprados
    const queryTopCursos = `
        SELECT c.titulo, COUNT(dc.curso_id) as total_compras
        FROM detalle_compra dc
        JOIN cursos c ON dc.curso_id = c.id
        GROUP BY dc.curso_id
        ORDER BY total_compras DESC
        LIMIT 3
    `;

    //Query para top 5 temas

    const queryTopTemas = `
    SELECT ct.tema, COUNT(*) as total
    FROM curso_temas ct
    GROUP BY ct.tema
    ORDER BY total DESC
    LIMIT 5
    `

    // Query para volumen de compras por mes

    const queryComprasMes = `
    
    `


}
// grafico.js
document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('myChart');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [{
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                borderWidth: 1,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)',
                    'rgba(255, 159, 64, 0.5)'
                ]
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
});