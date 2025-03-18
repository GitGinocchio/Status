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
    const labels = rows.map(entry => new Date(entry.timestamp).toLocaleTimeString());
    const latencies = rows.map(entry => entry.latency);

    // Crea il grafico
    const ctx = document.getElementById("ServiceChart").getContext("2d");
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, "rgba(54, 162, 235, 0.6)");
    gradient.addColorStop(1, "rgba(54, 162, 235, 0.1)");

    new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Latenza nel Tempo",
                    data: latencies,
                    borderColor: "rgba(54, 162, 235, 1)",
                    backgroundColor: gradient,
                    borderWidth: 2,
                    fill: true,
                    pointRadius: 5,
                    pointBackgroundColor: "rgba(54, 162, 235, 1)",
                    tension: 0.3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Orario"
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: "Latenza (s)"
                    }
                }
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', queryDatabase);
