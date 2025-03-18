async function loadDatabase(path) {
    const response = await fetch(path);
    const data = await response.json();  // Carica i dati JSON

    return data;  // Restituisce i dati JSON
}

async function queryDatabase() {
    const urlParams = new URLSearchParams(window.location.search);

    let basePath = window.location.hostname.includes("127.0.0.1") || window.location.hostname.includes("localhost") ? 
                    '' : "/" + window.location.pathname.split("/")[1];

    let name = urlParams.get("name");

    if (!name) {
        console.log("Parametro 'name' non fornito");
        name = "syncify"; // Imposta un valore di default
        // Qui si potrebbe chiedere all'utente di inserire il nome di un servizio
        // Si potrebbe fare una box con le scelte dei servizi disponibili...
    }

    // Carica i dati dal file JSON
    const data = await loadDatabase(`${window.location.origin}${basePath}/data/database.json`);

    // Filtra i dati in base al nome
    const rows = data.metrics.filter(entry => entry.name === name);

    // Estrai le etichette (timestamp) e le latenze
    const labels = rows.map(entry => {
        const date = new Date(entry.timestamp)
        return date.toLocaleString();
    });

    const latencies = rows.map(entry => entry.latency);
    const max_latencies = rows.map(entry => entry.max_latency);
    const min_latencies = rows.map(entry => entry.min_latency);
    const avg_latencies = rows.map(entry => entry.avg_latency);

    // Crea il grafico
    const canvas = document.getElementById("ServiceChart")
    const ctx = canvas.getContext("2d");
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, "rgba(54, 162, 235, 0.6)");
    gradient.addColorStop(1, "rgba(54, 162, 235, 0.1)");

    const chart = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Avg Latency",
                    data: avg_latencies,
                    borderColor: "rgba(255, 206, 86, 1)",
                    borderWidth: 2,
                    borderDash: [10, 5], // Linea tratteggiata
                    fill: false
                },
                {
                    label: "Min latency",
                    data: min_latencies,
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 2,
                    borderDash: [5, 5],
                    fill: false
                },
                {
                    label: "Max Latency",
                    data: max_latencies,
                    borderColor: "rgba(255, 99, 132, 1)",
                    borderWidth: 2,
                    borderDash: [5, 10],
                    fill: false
                },
                {
                    label: "Latency in Time",
                    data: latencies,
                    borderColor: "rgba(54, 162, 235, 1)",
                    backgroundColor: gradient,
                    borderWidth: 2,
                    fill: true,
                    pointRadius: 5,
                    pointBackgroundColor: "rgba(54, 162, 235, 1)",
                    cubicInterpolationMode: 'monotone',
                    tension: 0.3
                }
            ]
        },
        options: {
            responsive: true,
            animation: true,
            maintainAspectRatio: false,
            animation: { duration: 500 },
            interaction: {
                mode : 'nearest',
                intersect: false,
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Datetime"
                    },
                    min: labels.length > 50 ? labels.length - 50 : 0, // Mostra solo gli ultimi 10 punti inizialmente
                    max: labels.length - 1,                           // Fissa il massimo all'ultimo valore
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: "Latency (s)"
                    },
                    min: 0,
                    max: Math.max(...latencies) * 1.2  // Blocca il massimo
                }
            },
            plugins: {
                zoom: {
                    pan: {
                        enabled: true,
                        mode: 'x',
                        threshold: 0.1,
                        touch: {
                            enabled: true, // Abilita il pan su touch
                            threshold: 5  // Sensibilità minima del pan su telefono
                        },
                        onPanComplete: ({ chart }) => {
                            chart.update("none"); // Evita scatti
                        }
                    },
                    zoom: {
                        wheel: {
                            enabled: true, // Zoom con rotella del mouse
                        },
                        pinch: {
                            enabled: true // Zoom con gesture touchscreen
                        },
                        mode: "x" // Solo asse X
                    }
                }
                
            }
        }
    });

    // Aggiunge il reset dello zoom al doppio click
    canvas.addEventListener("dblclick", () => {
        chart.resetZoom();
    });


    // Reset zoom al doppio tap su mobile
    let lastTap = 0;
    canvas.addEventListener("touchend", (event) => {
        let currentTime = new Date().getTime();
        let tapLength = currentTime - lastTap;
        if (tapLength < 300 && tapLength > 0) {  // Se il doppio tap avviene entro 300ms
            chart.resetZoom();
        }
        lastTap = currentTime;
    });
}

document.addEventListener('DOMContentLoaded', queryDatabase);
