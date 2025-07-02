
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Iniciando carga de estadísticas...');

    // Verificar si los elementos canvas existen
    const ctxCursos = document.getElementById('graficoCursos');
    const ctxTemas = document.getElementById('graficoTemas');
    const ctxCompras = document.getElementById('graficoCompras');

    if (!ctxCursos || !ctxTemas || !ctxCompras) {
        console.error('No se encontraron uno o más elementos canvas:', {
            cursos: !!ctxCursos,
            temas: !!ctxTemas,
            compras: !!ctxCompras
        });
        return;
    }

    try {
        console.log('Realizando llamada a la API...');
        const response = await fetch('http://localhost:5000/api/admin/estadisticas');
        console.log('Respuesta recibida:', response.status);

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const result = await response.json();
        console.log('Datos recibidos:', result);

        if (!result.success) {
            console.error('Error en la respuesta:', result.mensaje);
            return;
        }

        const { cursos, temas, compras } = result.data;

        // Verificar que los datos existen
        console.log('Datos para gráficos:', {
            cursos: cursos,
            temas: temas,
            compras: compras
        });

        // Gráfico de Cursos más Comprados
        console.log('Creando gráfico de cursos...');
        new Chart(ctxCursos, {
            type: 'bar',
            data: {
                labels: cursos.labels,
                datasets: [{
                    label: 'Cursos más Comprados',
                    data: cursos.data,
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });

        // Gráfico de Temas más Frecuentes
        console.log('Creando gráfico de temas...');
        new Chart(ctxTemas, {
            type: 'pie',
            data: {
                labels: temas.labels,
                datasets: [{
                    data: temas.data,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.5)',
                        'rgba(54, 162, 235, 0.5)',
                        'rgba(255, 206, 86, 0.5)',
                        'rgba(75, 192, 192, 0.5)',
                        'rgba(153, 102, 255, 0.5)'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'right'
                    },
                    title: {
                        display: true,
                        text: 'Distribución de Temas'
                    }
                }
            }
        });

        // Gráfico de Compras por Mes
        console.log('Creando gráfico de compras...');
        new Chart(ctxCompras, {
            type: 'line',
            data: {
                labels: compras.labels,
                datasets: [{
                    label: 'Compras por Mes',
                    data: compras.data,
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });

        console.log('Todos los gráficos creados exitosamente');

    } catch (error) {
        console.error('Error al cargar las estadísticas:', error);
    }
});