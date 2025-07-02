document.addEventListener('DOMContentLoaded', function() {
    // Configuración común para todos los gráficos
    const configComun = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    boxWidth: 12,
                    font: {
                        size: 10
                    }
                }
            },
            tooltip: {
                bodyFont: {
                    size: 10
                },
                titleFont: {
                    size: 10
                }
            }
        }
    };

    // Función para obtener estadísticas desde la API
    async function obtenerEstadisticas() {
        try {
            const response = await fetch('http://localhost:5000/api/admin/estadisticas');
            if (!response.ok) {
                throw new Error('Error al obtener estadísticas');
            }
            const data = await response.json();

            if (data.success) {
                // Mostrar datos en los gráficos
                crearGraficoCursos(data.data.cursos);
                crearGraficoTemas(data.data.temas);
                crearGraficoCompras(data.data.compras);
            } else {
                console.error('Error en la respuesta del servidor:', data.mensaje);
            }
        } catch (error) {
            console.error('Error al obtener estadísticas:', error);
        }
    }

    // Función para crear el gráfico de cursos más comprados
    function crearGraficoCursos(datos) {
        new Chart(document.getElementById('cursosChart'), {
            type: 'pie',
            data: {
                labels: datos.labels,
                datasets: [{
                    data: datos.data,
                    backgroundColor: [
                        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                ...configComun,
                plugins: {
                    title: {
                        display: true,
                        text: '3 cursos más comprados',
                        font: {
                            size: 16
                        }
                    },
                    ...configComun.plugins,
                    tooltip: {
                        ...configComun.plugins.tooltip,

                    }
                }
            }
        });
    }


    // Gráfico de barras compacto
    function crearGraficoTemas(datos) {
        new Chart(document.getElementById('temasChart'), {
            type: 'bar',
            data: {
                labels: datos.labels,
                datasets: [{
                    label: 'Cursos',
                    data: datos.data,
                    backgroundColor: '#36A2EB',
                    borderWidth: 1
                }]
            },
            options: {
                indexAxis: 'y',
                ...configComun,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1,
                            font: {
                                size: 9
                            }
                        }
                    },
                    x: {
                        ticks: {
                            font: {
                                size: 9
                            }
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: '5 temas más utilizados',
                        font: {
                            size: 16
                        }
                    },

                    ...configComun.plugins,
                    legend: {
                        display: false
                    }
                }
            }
        });
    }


    // Función para crear el gráfico de compras por mes
    function crearGraficoCompras(datos) {
        const ctx = document.getElementById('comprasChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: datos.labels,
                datasets: [{
                    label: 'Compras por mes',
                    data: datos.data,
                    fill: false,
                    backgroundColor: 'rgba(7z5, 192, 192, 0.7)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    tension: 0.1,
                    borderWidth: 2
                }]
            },
            options: {

                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Compras en los últimos 6 meses',
                        font: {
                            size: 16
                        }
                    }
                },
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
    }

    // Llamar a la función para obtener estadísticas cuando la página cargue
    obtenerEstadisticas();
});