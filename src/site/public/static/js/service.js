import { fetchData } from './utils/commons.js';
import { getLatencyGraphConfig } from './utils/charts.js';

async function showGraphs(service_name) {
    const data = await fetchData();

    const rows = data.metrics.filter(entry => entry.name === service_name);

    const labels = rows.map(entry => {
        const date = new Date(entry.timestamp);
        return window.innerWidth > 756 ? date.toLocaleString() : `${date.getHours()}:${date.getMinutes()}`;
    });

    const latencies = rows.map(entry => entry.latency);
    const max_latencies = rows.map(entry => entry.max_latency);
    const min_latencies = rows.map(entry => entry.min_latency);
    const avg_latencies = rows.map(entry => entry.avg_latency);

    const canvas = document.getElementById("LatencyChart")
    const ctx = canvas.getContext("2d");

    const chart = new Chart(ctx, getLatencyGraphConfig(ctx,
        {
            'labels': labels,
            'latencies': latencies,
            'avg_latencies': avg_latencies,
            'min_latencies': min_latencies,
            'max_latencies': max_latencies
        }
    ));

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

    // Aggiunge il ridimensionamento al doppio click
    canvas.addEventListener("dblclick", (event) => {
        chart.resetZoom();
        chart.update();
    });
}

document.getElementById("services-button").addEventListener("click", async function() {
    const serviceValue = document.getElementById('services').value;

    if (serviceValue === "") { return; }

    const services_dropdown = document.getElementById("services-dropdown");
    const graphs = document.getElementById("graphs");

    services_dropdown.classList.add("hidden");
    graphs.classList.remove("hidden");

    await showGraphs(serviceValue);
});

document.addEventListener('DOMContentLoaded', async function () {
    const graphs = document.getElementById("graphs");
    const services_dropdown = document.getElementById("services-dropdown");

    const urlParams = new URLSearchParams(window.location.search);
    let name = urlParams.get("name");

    if (name) {
        graphs.classList.remove("hidden");
        services_dropdown.classList.add("hidden");
        await showGraphs(name);
    }
    else { 
        services_dropdown.classList.remove("hidden");
    }
});