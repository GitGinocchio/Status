async function loadDatabase(path) {
    const SQL = await initSqlJs({ locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}` });

    const response = await fetch(path);
    const buffer = await response.arrayBuffer();
    const db = new SQL.Database(new Uint8Array(buffer));

    return db;
}

async function queryDatabase() {
    const urlParams = new URLSearchParams(window.location.search);
    let name = urlParams.get("name");

    if (!name) {
        console.log("Parametro 'name' non fornito");
        //return;
        name = "syncify"
    }

    const db = await loadDatabase(`https://github.com/GitGinocchio/Status/raw/refs/heads/main/data/database.db`);

    const stmt = db.prepare("SELECT * FROM metrics WHERE name = ?");
    stmt.bind([name]);

    let rows = [];
    while (stmt.step()) {
        const row = stmt.getAsObject();
        rows.push(row);
    };

    stmt.free();

    const labels = rows.map(entry => new Date(entry.timestamp).toLocaleTimeString());
    const latencies = rows.map(entry => entry.latency);

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
                    tension: 0.3 // Per curve più fluide
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